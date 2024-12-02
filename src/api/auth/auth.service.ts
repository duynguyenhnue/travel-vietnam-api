import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { RefreshTokenRequest } from "../../payload/request/refresh-token.request";
import { User } from "../../schema/user.schema";
import { RefreshToken } from "../../schema/refresh.schema";
import { UserService } from "../users/users.service";
import { CreateUserRequest } from "../../payload/request/users.request";
import {
  AuthLogoutRequest,
  AuthRequest,
} from "../../payload/request/auth.request";
import { CommonException } from "../../common/exception/common.exception";
import { RefreshTokenService } from "../refresh-token/refresh-token.service";
import * as crypto from "crypto";
import { RefreshTokenResponse } from "../../payload/response/refresh-token.request";
import { FirebaseService } from "../firebase/firebase.service";
import { Folder } from "src/enums/folder.enum";
import { MailerService } from "../mailer/mailer.service";
import { VerificationCodeService } from "../verification-code/verification-code.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly firebaseService: FirebaseService,
    private readonly mailerService: MailerService,
    private readonly verificationCodeService: VerificationCodeService
  ) {}

  async validateUser(authRequest: AuthRequest): Promise<any> {
    const user = await this.userService.findUserByEmail(authRequest.email);
    if (user && (await bcrypt.compare(authRequest.password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(authRequest: AuthRequest, origin: string): Promise<any> {
    const user = await this.validateUser(authRequest);

    if (!user) {
      throw new CommonException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    if (user.status === "INACTIVE") {
      throw new CommonException("User is inactive", HttpStatus.UNAUTHORIZED);
    }

    if (origin === process.env.DOMAIN_ADMIN && user.role === "USER") {
      throw new CommonException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    if (origin === process.env.DOMAIN_CLIENT && user.role !== "USER") {
      throw new CommonException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    const payload = { email: user.email, sub: user._id, role: user.role };
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || "JWT_SECRET",
      expiresIn: "7d",
    });
    const refresh_token = crypto.randomBytes(16).toString("hex");

    await this.refreshTokenService.storeToken(user._id, refresh_token);

    return { access_token, refresh_token };
  }

  async registerUser(
    createUserRequest: CreateUserRequest,
    file?: Express.Multer.File
  ): Promise<User> {
    const existingAuth = await this.userService.findUserByEmail(
      createUserRequest.email
    );

    if (existingAuth) {
      throw new CommonException(
        `User width { Email: ${createUserRequest.email} } exists`,
        HttpStatus.CONFLICT
      );
    }
    let avatar = null;

    if (file) {
      avatar = await this.firebaseService.uploadImage(file, Folder.USERS);
    }

    const hashedPassword = await bcrypt.hash(createUserRequest.password, 10);
    const createdUser = new this.userModel({
      ...createUserRequest,
      password: hashedPassword,
      avatar,
    });
    return createdUser.save();
  }

  async refreshToken(
    refreshTokenRequest: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    return await this.refreshTokenService.refreshToken(refreshTokenRequest);
  }

  async logout(refresh_token: AuthLogoutRequest) {
    await this.refreshTokenService.deleteToken(refresh_token);
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new CommonException("User not found", HttpStatus.NOT_FOUND);
    }
    const code = await this.verificationCodeService.generateCode(
      user._id.toString()
    );
    return await this.mailerService.sendEmail({
      recipient: email,
      subject: "Forgot password",
      body: `Your verification code is ${code}. Please use this code to reset your password. Expire in 5 minutes.`,
    });
  }

  async verifyCode(verifyCodeRequest: { email: string; code: string }) {
    const user = await this.userService.findUserByEmail(
      verifyCodeRequest.email
    );
    if (!user) {
      throw new CommonException("User not found", HttpStatus.NOT_FOUND);
    }
    await this.verificationCodeService.verifyCode(
      user._id.toString(),
      verifyCodeRequest.code
    );
    const password = crypto.randomBytes(5).toString("hex");
    await this.mailerService.sendEmail({
      recipient: user.email,
      subject: "New password",
      body: `Your new password is ${password}. Please use this password to login.`,
    });
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userService.updateUser(user._id.toString(), {
      password: hashedPassword,
    });
    return "The code is correct, and the password has been updated";
  }
}
