import { Injectable, NotFoundException, UploadedFiles } from "@nestjs/common";
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
import { promises } from "dns";
import { TourResponse } from "src/payload/response/tours.response";
import { plainToInstance } from "class-transformer";

@Injectable()
export class TourService {
  constructor(
    @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
    private readonly firebaseService: FirebaseService,
    private readonly hotelsService: HotelsService,
    private readonly reviewService: ReviewService
  ) {}

  async createTour(
    createTourDto: CreateTourDto,
    files: Express.Multer.File[]
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

  async deleteTour(id: string): Promise<void> {
    const result = await this.tourModel.findById(id).exec();
    result.isDeleted = true;
    await result.save();

    if (!result) {
      throw new NotFoundException("Tour not found");
    }
  }

  async getSingleTour(id: string): Promise<TourResponse> {
    const tour = await this.tourModel.findById(id).populate("reviews").exec();

    if (!tour) {
      throw new NotFoundException("Tour not found");
    }

    const reviews = await this.reviewService.getReviews(
      tour.reviews as unknown as string[]
    );

    return { ...tour.toObject(), reviews };
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
    query: SearchTourRequestDto
  ): Promise<{ data: TourResponse[]; total: number }> {
    const { title, groupSize, limit, page } = query;
    const offset = page * limit;
    const filter: any = {};

    if (title) {
      filter.title = new RegExp(title, "i");
    }
    if (groupSize) {
      filter.maxGroupSize = { $gte: groupSize };
    }

    if (query.price) {
      filter.price = { $lte: query.price };
    }

    if (query.status.length > 0) {
      filter.status = query.status;
    }

    const tours = await this.tourModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
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
}
