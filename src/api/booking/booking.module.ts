import { Module } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { BookingController } from "./booking.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Booking, BookingSchema } from "src/schema/booking.schema";
import { TourModule } from "../tour/tour.module";
import { UserModule } from "../users/users.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    TourModule,
    UserModule,
  ],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
