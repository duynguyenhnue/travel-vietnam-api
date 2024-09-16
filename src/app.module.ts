import "dotenv/config";

import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./api/users/users.module";
import { AuthModule } from "./api/auth/auth.module";
import { PhotoModule } from "./api/photo/photo.module";
import { DestinationModule } from "./api/destination/destination.module";
import { ReviewModule } from "./api/review/review.module";
import { FollowerModule } from "./api/follower/follower.module";
import { MessageModule } from "./api/message/message.module";
import { ActivityModule } from "./api/activity/activity.module";
import { TripsModule } from "./api/trips/trips.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./common/guards/jwt-auth.gaurd";
import { RefreshTokenModule } from "./api/refresh-token/refresh-token.module";
import { RoleModule } from "./api/roles/role.module";
import { PermissionModule } from "./api/permission/permission.module";

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_MONGO_SRC),
    UserModule,
    AuthModule,
    TripsModule,
    PhotoModule,
    DestinationModule,
    ReviewModule,
    FollowerModule,
    MessageModule,
    ActivityModule,
    RefreshTokenModule,
    RoleModule,
    PermissionModule,
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
