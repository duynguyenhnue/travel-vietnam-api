import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { CreateReviewRequest } from "src/payload/request/tour.request";
import { Review, ReviewDocument } from "src/schema/review.schema";
import { Tour, TourDocument } from "src/schema/tour.schema";
import { TourService } from "../tour/tour.service";
import { UserService } from "../users/users.service";
import { HotelsService } from "../hotels/hotels.service";
import { Hotel, HotelDocument } from "src/schema/hotel.schema";

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => TourService))
    private readonly tourService: TourService,
    // @Inject(forwardRef(() => HotelsService))
    // private readonly hotelService: HotelsService
  ) {}

  async createReview(
    id: string,
    type: string,
    createReviewDto: CreateReviewRequest,
    userId: string
  ): Promise<Review> {
    await this.tourService.getSingleTour(id);
    await this.userService.findUserById(userId);
    const newReview = {
      ...createReviewDto,
      tourId: id,
      userId: userId,
    };

    const createReview = new this.reviewModel(newReview);
    const savedReview = await createReview.save();

    const updatedTour = await this.tourModel
      .findByIdAndUpdate(
        id,
        { $push: { reviews: savedReview._id } },
        { new: true }
      )
      .exec();

    if (!updatedTour) {
      throw new NotFoundException("Tour not found");
    }

    return savedReview;
  }

  async getReviews(id: string[]): Promise<Review[]> {
    const reviews = await this.reviewModel
      .find({ _id: { $in: id } })
      .exec();

    if (!reviews) {
      throw new NotFoundException("Review not found");
    }

    return reviews;
  }

  async getReviewsRating(id: string[]): Promise<Review[]> {
    const reviews = await this.reviewModel
      .find({ _id: { $in: id } }, { _id: 0, rating: 1 })
      .exec();

    if (!reviews) {
      throw new NotFoundException("Review not found");
    }

    return reviews;
  }
}
