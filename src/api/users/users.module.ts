import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "../auth/auth.module";
import { User, UserSchema } from "../../schema/user.schema";
import { UserController } from "./users.controller";
import { UserService } from "./users.service";
import { RefreshTokenModule } from "../refresh-token/refresh-token.module";
import { RoleModule } from "../roles/role.module";
import { PermissionModule } from "../permission/permission.module";
import { HotelsModule } from "../hotels/hotels.module";
import { Hotel, HotelSchema } from "src/schema/hotel.schema";
import { Tour, TourSchema } from "src/schema/tour.schema";
import { Booking, BookingSchema } from "src/schema/booking.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
    MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }]),
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => RefreshTokenModule),
    forwardRef(() => RoleModule),
    forwardRef(() => PermissionModule),
  ],

  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
