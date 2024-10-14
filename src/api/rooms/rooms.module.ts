import { Module, forwardRef } from "@nestjs/common";
import { RoomsController } from "./rooms.controller";
import { RoomsService } from "./rooms.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Room, RoomSchema } from "src/schema/room.schema";
import { FirebaseModule } from "../firebase/firebase.module";
import { HotelsModule } from "../hotels/hotels.module";
import { RoleModule } from "../roles/role.module";
import { PermissionModule } from "../permission/permission.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    FirebaseModule,
    HotelsModule,
    forwardRef(() => RoleModule),
    forwardRef(() => PermissionModule),
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
