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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
    FirebaseModule,
    forwardRef(() => RoleModule),
    forwardRef(() => PermissionModule),
    // forwardRef(() => ReviewModule),
    // forwardRef(() => TourModule),
    UserModule
  ],
  controllers: [HotelsController],
  providers: [HotelsService],
  exports: [HotelsService, MongooseModule],
})
export class HotelsModule {}
