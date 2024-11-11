import { Module, forwardRef } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { BookingController } from "./booking.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Booking, BookingSchema } from "src/schema/booking.schema";
import { TourModule } from "../tour/tour.module";
import { UserModule } from "../users/users.module";
import { RoleModule } from "../roles/role.module";
import { PermissionModule } from "../permission/permission.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
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
