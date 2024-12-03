import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UploadedFiles,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { plainToInstance } from "class-transformer";
import { Hotel } from "src/schema/hotel.schema";
import {
  CreateHotelRequestDto,
  SearchHotelsRequestDto,
  UpdateHotelRequestDto,
} from "src/payload/request/hotels.request";
import { HotelResponseDto } from "src/payload/response/hotels.response";
import { FirebaseService } from "../firebase/firebase.service";
import { Folder } from "src/enums/folder.enum";
import { CommonException } from "src/common/exception/common.exception";
import { UserService } from "../users/users.service";
import { Room } from "src/schema/room.schema";
import { Review } from "src/schema/review.schema";
import { User } from "src/schema/user.schema";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class HotelsService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<Hotel>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    private readonly firebaseService: FirebaseService,
    private readonly userService: UserService,
    private jwtService: JwtService
  ) {}

  async create(
    createHotelDto: CreateHotelRequestDto,
    files: Express.Multer.File[],
    userId: ObjectId
  ): Promise<HotelResponseDto> {
    const photos = await Promise.all(
      (files || []).map(async (file) => {
        return await this.firebaseService.uploadImage(file, Folder.HOTELS);
      })
    );

    const data = {
      ...createHotelDto,
      photos,
      userId,
    };

    const createdHotel = new this.hotelModel(data);
    const savedHotel = await createdHotel.save();
    return plainToInstance(HotelResponseDto, savedHotel.toObject());
  }
  async validateToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET, // Secret key của bạn
      });
      return decoded; // Trả về payload sau khi giải mã
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }

  async getHotelBySearch(
    query: SearchHotelsRequestDto,
    user: any | null
  ): Promise<{ data: HotelResponseDto[]; total: number }> {
    const { name, maxGroupSize, limit, page, price, status, city } = query;
    const offset = page * limit;

    const filter: any = {};

    if (user && user.role !== "USER" && user.role !== "ADMIN") {
      filter.userId = user.sub;
    }

    if (name && name.trim() !== "") {
      filter.name = new RegExp(name, "i");
    }

    if (city && city.trim() !== "") {
      filter["address.province"] = city;
    }

    if (maxGroupSize && !isNaN(Number(maxGroupSize))) {
      filter.maxGroupSize = { $gte: parseInt(maxGroupSize.toString(), 10) };
    }

    if (price && !isNaN(Number(price))) {
      filter.price = { $lte: parseInt(price.toString(), 10) };
    }

    if (status && status.trim() !== "") {
      filter.status = status;
    }

    const hotels = await this.hotelModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();

    const hotelsMap: HotelResponseDto[] = await Promise.all(
      hotels.map(async (hotel) => {
        const reviews = await this.getReviews(
          hotel.reviews as unknown as string[]
        );
        return { ...hotel.toObject(), reviews };
      })
    );

    const total = await this.hotelModel.countDocuments(filter).exec();

    return { data: hotelsMap, total };
  }

  async getSingleHotel(id: string): Promise<HotelResponseDto> {
    const hotel = await this.hotelModel.findById(id).populate("reviews").exec();
    if (!hotel) {
      throw new NotFoundException("Hotel not found");
    }

    const reviews = await this.getReviews(hotel.reviews as unknown as string[]);

    const reviewsWithUserDetails = await Promise.all(
      reviews.map(async (review) => {
        const user = await this.userService.findUserById(review.userId);
        return {
          _id: review._id,
          userId: review.userId,
          avatar: user.avatar,
          fullName: user.fullName,
          rating: review.rating,
          reviewText: review.reviewText,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
        };
      })
    );
    return { ...hotel.toObject(), reviews: reviewsWithUserDetails };
  }

  async getReviews(id: string[]): Promise<Review[]> {
    const reviews = await this.reviewModel.find({ _id: { $in: id } }).exec();

    if (!reviews) {
      throw new NotFoundException("Review not found");
    }

    return reviews;
  }

  async findOne(
    id: ObjectId
  ): Promise<{ hotel: HotelResponseDto; rooms: Room[] }> {
    const hotel = await this.hotelModel.findById(id).populate("reviews").exec();
    if (!hotel) {
      throw new NotFoundException("Hotel not found");
    }

    const reviews = await this.getReviews(hotel.reviews as unknown as string[]);

    const reviewsWithUserDetails = await Promise.all(
      reviews.map(async (review) => {
        const user = await this.userService.findUserById(review.userId);
        if (review.reply) {
          review.reply = await Promise.all(
            review.reply.map(async (reply) => {
              const user = await this.userService.findUserById(reply.userId);
              return {
                ...reply,
                avatar: user.avatar,
                fullName: user.fullName,
              };
            })
          );
        }
        return {
          _id: review._id,
          userId: review.userId,
          avatar: user.avatar,
          fullName: user.fullName,
          rating: review.rating,
          reviewText: review.reviewText,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
          reply: review.reply,
        };
      })
    );
    const hotelNew = { ...hotel.toObject(), reviews: reviewsWithUserDetails };

    const rooms = await this.roomModel.find({ hotelId: id }).exec();

    return {
      hotel: hotelNew,
      rooms: rooms,
    };
  }

  async update(
    id: string,
    updateHotelDto: UpdateHotelRequestDto,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<Hotel> {
    await this.getSingleHotel(id);

    const newData = updateHotelDto;

    if (files) {
      await Promise.all(
        files.map(async (file) => {
          newData.photos.push(
            await this.firebaseService.uploadImage(file, Folder.HOTELS)
          );
        })
      );
    }

    const updatedHotel = await this.hotelModel
      .findByIdAndUpdate(id, newData, { new: true })
      .exec();
    return updatedHotel;
  }

  async delete(id: ObjectId): Promise<string> {
    await this.findOne(id);
    await this.hotelModel.findByIdAndDelete(id).exec();
    return "Deleted successfully";
  }

  async getHotelByName(): Promise<{ id: string; name: string }[]> {
    const hotels = await this.hotelModel.find({}).exec();
    return hotels.map((hotel) => ({
      id: hotel._id.toString(),
      name: hotel.name,
    }));
  }
}
