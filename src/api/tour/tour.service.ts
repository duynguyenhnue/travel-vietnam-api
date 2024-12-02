import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UploadedFiles,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  CreateTourDto,
  GetTourRequestDto,
  SearchTourRequestDto,
  UpdateTourDto,
} from "src/payload/request/tour.request";
import { Tour, TourDocument } from "src/schema/tour.schema";
import { FirebaseService } from "../firebase/firebase.service";
import { Folder } from "src/enums/folder.enum";
import { HotelsService } from "../hotels/hotels.service";
import { ReviewService } from "../review/review.service";
import { TourResponse } from "src/payload/response/tours.response";
import { TourStatus } from "src/enums/booking.enum";
import { UserService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TourService {
  constructor(
    @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
    private readonly firebaseService: FirebaseService,
    private readonly hotelsService: HotelsService,
    private readonly reviewService: ReviewService,
    private readonly userService: UserService,
    private jwtService: JwtService
  ) {}

  async createTour(
    createTourDto: CreateTourDto,
    files: Express.Multer.File[],
    userId: string
  ): Promise<Tour> {
    await this.hotelsService.findOne(createTourDto.hotelId);

    const photos = await Promise.all(
      (files || []).map(async (file) => {
        return await this.firebaseService.uploadImage(file, Folder.TOURS);
      })
    );

    const newTour = {
      ...createTourDto,
      photos,
      userId,
    };

    const createTour = new this.tourModel(newTour);
    return await createTour.save();
  }

  async updateTour(
    id: string,
    updateTourDto: UpdateTourDto,
    files: Express.Multer.File[]
  ): Promise<Tour> {
    await this.getSingleTour(id);
    await this.hotelsService.findOne(updateTourDto.hotelId);
    const newData = updateTourDto;

    if (files) {
      await Promise.all(
        files.map(async (file) => {
          newData.photos.push(
            await this.firebaseService.uploadImage(file, Folder.HOTELS)
          );
        })
      );
    }

    const updatedTour = await this.tourModel
      .findByIdAndUpdate(id, { $set: newData }, { new: true })
      .exec();

    return updatedTour;
  }

  async cancelTour(id: string): Promise<void> {
    const result = await this.tourModel.findById(id).exec();
    if (result.isCancel) {
      throw new NotFoundException("Tour is already canceled");
    }
    result.isCancel = true;
    result.status = TourStatus.CANCELLED;
    await result.save();

    if (!result) {
      throw new NotFoundException("Tour not found");
    }
  }

  async deleteTour(id: string): Promise<Tour> {
    const result = await this.tourModel.findById(id).exec();

    if (result.isDeleted) {
      throw new NotFoundException("Tour is already deleted");
    }
    result.isDeleted = true;
    result.status = TourStatus.DELETED;
    await result.save();

    if (!result) {
      throw new NotFoundException("Tour not found");
    }
    return result;
  }

  async getSingleTour(id: string): Promise<TourResponse> {
    const tour = await this.tourModel.findById(id).populate("reviews").exec();
    if (!tour) {
      throw new NotFoundException("Tour not found");
    }

    const reviews = await this.reviewService.getReviews(
      tour.reviews as unknown as string[]
    );

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
    return { ...tour.toObject(), reviews: reviewsWithUserDetails };
  }

  async getAllTours(
    query: GetTourRequestDto
  ): Promise<{ data: Tour[]; total: number }> {
    const { limit = 12, page = 0 } = query;
    const offset = page * limit;

    const tours = await this.tourModel
      .find({})
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();

    const total = await this.tourModel.countDocuments().exec();

    return { data: tours, total };
  }

  async getTourBySearch(
    query: SearchTourRequestDto,
    user: any
  ): Promise<{ data: TourResponse[]; total: number }> {
    const { name, departurePoint, destination, groupSize, limit, page } = query;
    const offset = page * limit;
    const filter: any = {
      isDeleted: false,
    };

    if (user && user.role !== "USER" && user.role !== "ADMIN") {
      filter.userId = user.sub;
    }

    if (name) {
      filter.title = new RegExp(name, "i");
    }

    if (departurePoint) {
      filter["departurePoint.province"] = departurePoint;
    }

    if (destination) {
      filter["destination.province"] = destination;
    }
    if (groupSize) {
      filter.maxGroupSize = { $gte: groupSize };
    }

    if (query.price) {
      filter.price = { $lte: query.price };
    }

    if (query.status) {
      filter.status = query.status;
    }

    const tours = await this.tourModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();

    const toursMap: TourResponse[] = await Promise.all(
      tours.map(async (tour) => {
        const reviews = await this.reviewService.getReviews(
          tour.reviews as unknown as string[]
        );
        return { ...tour.toObject(), reviews };
      })
    );

    const total = await this.tourModel.countDocuments(filter).exec();

    return { data: toursMap, total };
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
}
