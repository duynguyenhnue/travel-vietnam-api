import { Module, forwardRef } from "@nestjs/common";
import { HotelsService } from "./hotels.service";
import { HotelsController } from "./hotels.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Hotel, HotelSchema } from "src/schema/hotel.schema";
import { FirebaseModule } from "../firebase/firebase.module";
import { RoleModule } from "../roles/role.module";
import { PermissionModule } from "../permission/permission.module";
import { ReviewModule } from "../review/review.module";
import { UserModule } from "../users/users.module";
import { TourModule } from "../tour/tour.module";
import { RoomsModule } from "../rooms/rooms.module";
import { Room, RoomSchema } from "src/schema/room.schema";
import { Review, ReviewSchema } from "src/schema/review.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    FirebaseModule,
    forwardRef(() => RoleModule),
    forwardRef(() => PermissionModule),
    UserModule,
  ],
  controllers: [HotelsController],
  providers: [HotelsService],
  exports: [HotelsService, MongooseModule],
})
export class HotelsModule {}
