import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateReviewRequest, ReplyReviewRequest } from "src/payload/request/tour.request";
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
    @Inject(forwardRef(() => HotelsService))
    private readonly hotelService: HotelsService,
  ) {}

  async createReview(
    id: string,
    type: string,
    createReviewDto: CreateReviewRequest,
    userId: string,
  ): Promise<Review> {
    if (type === "tour") {
      await this.tourService.getSingleTour(id);
    } else if (type === "hotel") {
      await this.hotelService.getSingleHotel(id);
    }
    await this.userService.findUserById(userId);
    let newReview;
    if (type === "tour") {
      newReview = {
        ...createReviewDto,
        userId: userId,
        tourId: id,
      };
    } else if (type === "hotel") {
      newReview = {
        ...createReviewDto,
        userId: userId,
        hotelId: id,
      };
    }

    const createReview = new this.reviewModel(newReview); 
    const savedReview = await createReview.save();

    if (type === "tour") {
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
    } else if (type === "hotel") {
      const updatedHotel = await this.hotelModel
      .findByIdAndUpdate(
        id,
        { $push: { reviews: savedReview._id } },
        { new: true }
      )
        .exec();

      if (!updatedHotel) {
        throw new NotFoundException("Hotel not found");
      }
    }
    return savedReview;
  }

  async createReply(replyReviewDto: ReplyReviewRequest, userId: string, id: string): Promise<Review> {
    const createReply = {
      ...replyReviewDto,
      userId: userId,
      _id: new Types.ObjectId(id),
    }
    let replys = await this.reviewModel.findById(id);

    if (replys.reply) {
      replys.reply.push(createReply);
    } else {
      replys.reply = [createReply];
    }

    const updatedReview = await this.reviewModel.findByIdAndUpdate(id, { $set: { reply: replys.reply } }, { new: true });

    if (!updatedReview) {
      throw new NotFoundException("Review not found");
    }

    return updatedReview;
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

  async getReviewsType(type: string): Promise<Review[]> {
    const query: any = { type };
    
    if (type === "hotel") {
      query.hotelId = { $exists: true, $ne: null };
    } else if (type === "tour") {
      query.tourId = { $exists: true, $ne: null };
    }

    const reviews = await this.reviewModel
      .find(query)
      .exec();

    if (!reviews || reviews.length === 0) {
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

  async deleteReview(id: string, userId: string): Promise<string> {
    await this.userService.findUserById(userId);
    const review = await this.reviewModel.findById(id);

    if (!review) {
      throw new NotFoundException("Review not found");
    }

    if (review.userId.toString() !== userId) {
      throw new ForbiddenException("You are not allowed to delete this review");
    }

    const deletedReview = await this.reviewModel.findByIdAndDelete(id);

    if (!deletedReview) {
      throw new NotFoundException("Review not found");
    }

    return "Review deleted successfully";
  }
}
