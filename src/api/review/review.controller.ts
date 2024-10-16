import { Controller, Post, Param, Body, HttpStatus } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { successResponse } from "src/common/dto/response.dto";
import { ParseObjectIdPipe } from "src/config/parse-objectId-pipe";
import { CreateReviewRequest } from "src/payload/request/tour.request";
import { CommonException } from "src/common/exception/common.exception";
import { AuthJwtAccessProtected } from "src/common/guards/role.guard";
import { AUTH_PERMISSIONS } from "src/enums/auth.enum";

@Controller("tours/:tourId/reviews")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.REVIEW_CREATE)
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
