import { forwardRef, Module } from "@nestjs/common";
import { TourController } from "./tour.controller";
import { TourService } from "./tour.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Tour, TourSchema } from "src/schema/tour.schema";
import { FirebaseModule } from "../firebase/firebase.module";
import { HotelsModule } from "../hotels/hotels.module";
import { ReviewModule } from "../review/review.module";
import { NotificationModule } from "src/notification/notification.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }]),
    FirebaseModule,
    HotelsModule,
    forwardRef(() => ReviewModule),
    NotificationModule,
  ],
  controllers: [TourController],
  providers: [TourService],
  exports: [TourService, MongooseModule],
})
export class TourModule {}
