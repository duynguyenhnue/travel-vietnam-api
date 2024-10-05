import { forwardRef, Module } from "@nestjs/common";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Review, ReviewSchema } from "src/schema/review.schema";
import { TourModule } from "../tour/tour.module";
import { UserModule } from "../users/users.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    forwardRef(() => TourModule), 
    UserModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService, MongooseModule],
})
export class ReviewModule {}
