import { forwardRef, HttpStatus, Inject, Injectable, NotFoundException, UploadedFiles } from "@nestjs/common";
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
import { ReviewService } from "../review/review.service";
import { UserService } from "../users/users.service";
import { ReviewModule } from "../review/review.module";
import { UserModule } from "../users/users.module";

@Injectable()
export class HotelsService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<Hotel>,
    private readonly firebaseService: FirebaseService,
  ) {}

  async create(
    createHotelDto: CreateHotelRequestDto,
    files: Express.Multer.File[]
  ): Promise<HotelResponseDto> {
    const photos = await Promise.all(
      (files || []).map(async (file) => {
        return await this.firebaseService.uploadImage(file, Folder.HOTELS);
      })
    );

    const data = {
      ...createHotelDto,
      photos,
    };

    const createdHotel = new this.hotelModel(data);
    const savedHotel = await createdHotel.save();
    return plainToInstance(HotelResponseDto, savedHotel.toObject());
  }

  async getHotelBySearch(
    query: SearchHotelsRequestDto
  ): Promise<{ data: HotelResponseDto[]; total: number }> {
    const { name, maxGroupSize, limit, page, price, status, city } = query;
    const offset = page * limit;

    const filter: any = {};

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
        return { ...hotel.toObject() };
      })
    );

    const total = await this.hotelModel.countDocuments(filter).exec();

    return { data: hotelsMap, total };
  }

  // async getSingleHotel(id: string): Promise<HotelResponseDto> {
  //   const hotel = await this.hotelModel.findById(id).populate("reviews").exec();
  //   if (!hotel) {
  //     throw new NotFoundException("Hotel not found");
  //   }

  //   const reviews = await this.reviewService.getReviews(
  //     hotel.reviews as unknown as string[]
  //   );

  //   const reviewsWithUserDetails = await Promise.all(
  //     reviews.map(async (review) => {
  //       const user = await this.userService.findUserById(review.userId);
  //       return {
  //         userId: review.userId,
  //         avatar: user.avatar,
  //         fullName: user.fullName,
  //         rating: review.rating,
  //         reviewText: review.reviewText,
  //         createdAt: review.createdAt,
  //         updatedAt: review.updatedAt,
  //       };
  //     })
  //   );
  //   return { ...hotel.toObject(), reviews: reviewsWithUserDetails };
  // }

  async findOne(id: ObjectId): Promise<HotelResponseDto> {
    const hotel = await this.hotelModel.findById(id).exec();

    if (!hotel) {
      throw new CommonException("Hotel not found", HttpStatus.NOT_FOUND);
    }
    return plainToInstance(HotelResponseDto, hotel.toObject());
  }

  async update(
    id: ObjectId,
    updateHotelDto: UpdateHotelRequestDto,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<HotelResponseDto> {
    await this.findOne(id);

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
    return plainToInstance(HotelResponseDto, updatedHotel.toObject());
  }

  async delete(id: ObjectId): Promise<string> {
    await this.findOne(id);
    await this.hotelModel.findByIdAndDelete(id).exec();
    return "Deleted successfully";
  }

}
