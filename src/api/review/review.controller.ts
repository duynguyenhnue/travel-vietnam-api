import { Controller, Post, Param, Body, HttpStatus, Req, Get, Delete } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { successResponse } from "src/common/dto/response.dto";
import { ParseObjectIdPipe } from "src/config/parse-objectId-pipe";
import { CreateReviewRequest, ReplyReviewRequest } from "src/payload/request/tour.request";
import { CommonException } from "src/common/exception/common.exception";
import { AuthJwtAccessProtected } from "src/common/guards/role.guard";
import { AUTH_PERMISSIONS } from "src/enums/auth.enum";

@Controller("reviews")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.REVIEW_GET)
  async getReview(
    @Param("type") type: string
  ) {
    return this.reviewService.getReviewsType(type);
  }

  @Post("/reply/:id")
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.REVIEW_CREATE)
  async createReply(
    @Param("id", ParseObjectIdPipe) id: string,
    @Body() replyReviewDto: ReplyReviewRequest,
    @Req() req
  ) {
    return this.reviewService.createReply(replyReviewDto, req.user.id, id);
  }

  @Post("/:id/:type")
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.REVIEW_CREATE)
  async createReview(
    @Param("id", ParseObjectIdPipe) id: string,
    @Param("type") type: string,
    @Body() createReviewDto: CreateReviewRequest,
    @Req() req
  ) {
    try {
      const savedReview = await this.reviewService.createReview(
        id,
        type,
        createReviewDto,
        req.user.id
      );
      return successResponse(savedReview);
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete("/:id")
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.REVIEW_DELETE)
  async deleteReview(@Param("id", ParseObjectIdPipe) id: string, @Req() req) {
    return this.reviewService.deleteReview(id, req.user.id);
  }
}
