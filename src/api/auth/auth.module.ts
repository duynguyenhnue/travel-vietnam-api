import { Module, forwardRef } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../users/users.module";
import { JwtStrategy } from "../../common/guards/jwtStratergy";
import { RefreshTokenModule } from "../refresh-token/refresh-token.module";
import { UserService } from "../users/users.service";
import { FirebaseModule } from "../firebase/firebase.module";
import { MailerModule } from "../mailer/mailer.module";
import { VerificationCodeModule } from "../verification-code/verification-code.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
      JwtModule.register({
        secret: process.env.JWT_SECRET || "JWT_SECRET",
        signOptions: { expiresIn: "7d" },
      }),
    forwardRef(() => UserModule),
    forwardRef(() => RefreshTokenModule),
    forwardRef(() => FirebaseModule),
    forwardRef(() => MailerModule),
    VerificationCodeModule
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserService],
  exports: [AuthService],
})
export class AuthModule {}
