import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateReviewRequest } from "src/payload/request/tour.request";
import { Review, ReviewDocument } from "src/schema/review.schema";
import { Tour, TourDocument } from "src/schema/tour.schema";
import { TourService } from "../tour/tour.service";
import { UserService } from "../users/users.service";

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
    private readonly tourService: TourService,
    private readonly userService: UserService
  ) {}

  async createReview(
    tourId: string,
    createReviewDto: CreateReviewRequest
  ): Promise<Review> {
    await this.tourService.getSingleTour(tourId);
    await this.userService.findUserById(createReviewDto.userId);
    const newReview = {
      ...createReviewDto,
      tourId,
    };

    const createReview = new this.reviewModel(newReview);
    const savedReview = await createReview.save();

    const updatedTour = await this.tourModel
      .findByIdAndUpdate(
        tourId,
        { $push: { reviews: savedReview._id } },
        { new: true }
      )
      .exec();

    if (!updatedTour) {
      throw new NotFoundException("Tour not found");
    }

    return savedReview;
  }
}
