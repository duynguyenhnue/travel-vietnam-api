import {
  MiddlewareConsumer,
  Module,
  NestModule,
  forwardRef,
} from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./api/users/users.module";
import { AuthModule } from "./api/auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./common/guards/jwt-auth.gaurd";
import { RefreshTokenModule } from "./api/refresh-token/refresh-token.module";
import { RoleModule } from "./api/roles/role.module";
import { PermissionModule } from "./api/permission/permission.module";
import { ConfigModule } from "@nestjs/config";
import { HotelsModule } from "./api/hotels/hotels.module";
import { RoomsModule } from "./api/rooms/rooms.module";
import { FirebaseModule } from "./api/firebase/firebase.module";
import { TourModule } from "./api/tour/tour.module";
import { ReviewModule } from "./api/review/review.module";
import { BookingModule } from "./api/booking/booking.module";
import { NotificationModule } from "./api/notification/notification.module";
import { HistoryModule } from "./api/history/history.module";
import { VnpayModule } from "./api/vnpay/vnpay.module";
import { DiscountsModule } from "./api/discounts/discounts.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_MONGO_SRC),
    UserModule,
    AuthModule,
    RefreshTokenModule,
    RoleModule,
    PermissionModule,
    HotelsModule,
    DiscountsModule,
    RoomsModule,
    FirebaseModule,
    TourModule,
    ReviewModule,
    BookingModule,
    NotificationModule,
    HistoryModule,
    VnpayModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
