import { Module, forwardRef } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { BookingController } from "./booking.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Booking, BookingSchema } from "src/schema/booking.schema";
import { TourModule } from "../tour/tour.module";
import { UserModule } from "../users/users.module";
import { RoleModule } from "../roles/role.module";
import { PermissionModule } from "../permission/permission.module";
import { Hotel, HotelSchema } from "src/schema/hotel.schema";
import { Tour, TourSchema } from "src/schema/tour.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
    MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }]),
    TourModule,
    UserModule,
    forwardRef(() => RoleModule),
    forwardRef(() => PermissionModule),
  ],
  providers: [BookingService],
  controllers: [BookingController],
  exports: [BookingService, MongooseModule],
})
export class BookingModule {}
