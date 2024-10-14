import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "../auth/auth.module";
import { User, UserSchema } from "../../schema/user.schema";
import { UserController } from "./users.controller";
import { UserService } from "./users.service";
import { RefreshTokenModule } from "../refresh-token/refresh-token.module";
import { RoleModule } from "../roles/role.module";
import { PermissionModule } from "../permission/permission.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
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
