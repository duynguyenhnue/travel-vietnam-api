import { forwardRef, Module } from "@nestjs/common";
import { TourController } from "./tour.controller";
import { TourService } from "./tour.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Tour, TourSchema } from "src/schema/tour.schema";
import { FirebaseModule } from "../firebase/firebase.module";
import { HotelsModule } from "../hotels/hotels.module";
import { ReviewModule } from "../review/review.module";
import { NotificationModule } from "src/api/notification/notification.module";
import { RoleModule } from "../roles/role.module";
import { PermissionModule } from "../permission/permission.module";
import { UserModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }]),
    FirebaseModule,
    NotificationModule,
    HotelsModule,
    forwardRef(() => ReviewModule),
    forwardRef(() => RoleModule),
    forwardRef(() => PermissionModule),
    UserModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "JWT_SECRET",
      signOptions: { expiresIn: "7d" },
    }),
  ],
  controllers: [TourController],
  providers: [TourService],
  exports: [TourService, MongooseModule],
})
export class TourModule {}
