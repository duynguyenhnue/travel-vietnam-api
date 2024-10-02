import { Injectable, NotFoundException } from "@nestjs/common";
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

@Injectable()
export class TourService {
  constructor(
    @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
    private readonly firebaseService: FirebaseService
  ) {}

  async createTour(
    createTourDto: CreateTourDto,
    photo: Express.Multer.File
  ): Promise<Tour> {
    const newTour = {
      ...createTourDto,
      photo: await this.firebaseService.uploadImage(photo, Folder.TOURS),
    };

    const createTour = new this.tourModel(newTour);
    return await createTour.save();
  }

  async updateTour(id: string, updateTourDto: UpdateTourDto): Promise<Tour> {
    const updatedTour = await this.tourModel
      .findByIdAndUpdate(id, { $set: updateTourDto }, { new: true })
      .exec();

    if (!updatedTour) {
      throw new NotFoundException("Tour not found");
    }

    return updatedTour;
  }

  // Delete tour
  async deleteTour(id: string): Promise<void> {
    const result = await this.tourModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException("Tour not found");
    }
  }

  // Get a single tour
  async getSingleTour(id: string): Promise<Tour> {
    const tour = await this.tourModel.findById(id).populate("reviews").exec();

    if (!tour) {
      throw new NotFoundException("Tour not found");
    }

    return tour;
  }

  // Get all tours with pagination
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
  ): Promise<{ data: Tour[]; total: number }> {
    const { city, groupSize, limit, page } = query;
    const offset = page * limit;
    const filter: any = {};

    if (city) {
      filter.city = new RegExp(city, "i");
    }
    if (groupSize) {
      filter.maxGroupSize = { $gte: groupSize };
    }
    const tours = await this.tourModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .exec();

    const total = await this.tourModel.countDocuments(filter).exec();

    return { data: tours, total };
  }

  async getFeaturedTours(): Promise<{ data: Tour[]; total: number }> {
    const featuredTours = await this.tourModel
      .find({ featured: true })
      .populate("reviews")
      .limit(9)
      .exec();

    const total = await this.tourModel
      .countDocuments({ featured: true })
      .exec();

    return { data: featuredTours, total };
  }
}
