import { Controller, Post, Param, Body, HttpStatus } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { successResponse } from "src/common/dto/response.dto";
import { SkipAuth } from "src/config/skip.auth";
import { ParseObjectIdPipe } from "src/config/parse-objectId-pipe";
import { CreateReviewRequest } from "src/payload/request/tour.request";
import { CommonException } from "src/common/exception/common.exception";

@Controller("tours/:tourId/reviews")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @SkipAuth()
  @Post()
  async createReview(
    @Param("tourId", ParseObjectIdPipe) tourId: string,
    @Body() createReviewDto: CreateReviewRequest
  ) {
    try {
      const savedReview = await this.reviewService.createReview(
        tourId,
        createReviewDto
      );
      return successResponse(savedReview);
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
