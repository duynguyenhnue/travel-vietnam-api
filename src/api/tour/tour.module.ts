import { Module } from "@nestjs/common";
import { TourController } from "./tour.controller";
import { TourService } from "./tour.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Tour, TourSchema } from "src/schema/tour.schema";
import { FirebaseModule } from "../firebase/firebase.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }]),
    FirebaseModule,
  ],
  controllers: [TourController],
  providers: [TourService],
  exports: [TourService, MongooseModule],
})
export class TourModule {}
