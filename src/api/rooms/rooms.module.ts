import { Module, forwardRef } from "@nestjs/common";
import { RoomsController } from "./rooms.controller";
import { RoomsService } from "./rooms.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Room, RoomSchema } from "src/schema/room.schema";
import { FirebaseModule } from "../firebase/firebase.module";
import { HotelsModule } from "../hotels/hotels.module";
import { RoleModule } from "../roles/role.module";
import { PermissionModule } from "../permission/permission.module";
import { BookingModule } from "../booking/booking.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    FirebaseModule,
    HotelsModule,
    forwardRef(() => RoleModule),
    forwardRef(() => PermissionModule),
    BookingModule,
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService, MongooseModule],
})
export class RoomsModule {}
