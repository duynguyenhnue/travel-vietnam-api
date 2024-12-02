import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";
import { User } from "../../schema/user.schema";
import {
  CreateUserRequest,
  SearchUserRequest,
  UpdateUserRequest,
} from "../../payload/request/users.request";
import { UserResponse } from "src/payload/response/users.request";
import { plainToInstance } from "class-transformer";
import { Hotel } from "src/schema/hotel.schema";
import { Tour } from "src/schema/tour.schema";
import { Booking } from "src/schema/booking.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Hotel.name) private readonly hotelModel: Model<Hotel>,
    @InjectModel(Tour.name) private readonly tourModel: Model<Tour>,
    @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>
  ) {}

  async onModuleInit() {
    await this.createDefaultUser();
  }

  async createDefaultUser(): Promise<User> {
    const defaultUser = {
      email: "admin@travel.com",
      fullName: "Admin",
      password: await bcrypt.hash("Admin123", 10),
      dateOfBirth: null,
      address: null,
      phone: null,
      role: "ADMIN",
    };

    const existingUser = await this.userModel
      .findOneAndUpdate({ email: defaultUser.email }, defaultUser, {
        upsert: true,
        new: true,
      })
      .exec();

    if (existingUser) {
      return existingUser;
    }

    const newUser = new this.userModel(defaultUser);
    return await newUser.save();
  }

  async login(loginUserRequest: any): Promise<User> {
    const user = await this.userModel
      .findOne({ email: loginUserRequest.email })
      .exec();
    if (
      !user ||
      !(await bcrypt.compare(loginUserRequest.password, user.password))
    ) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return user;
  }

  async getUser(user: User): Promise<UserResponse> {
    const userResponse = plainToInstance(UserResponse, user.toObject());
    return userResponse;
  }

  async findUser(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select("-password").exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async searchUsers(
    query: SearchUserRequest,
    user: User
  ): Promise<{ data: User[]; total: number }> {
    const { limit = 6, page = 0 } = query;
    const offset = page * limit;
    const filter: any = {};
    let userIds = [];

    if (user.role !== "ADMIN") {
      const hotels = await this.hotelModel.find({ userId: user._id }).exec();
      const tours = await this.tourModel.find({ userId: user._id }).exec();

      const bookings = await this.bookingModel
        .find({
          orderId: {
            $in: [
              ...hotels.map((hotel) => hotel._id.toString()),
              ...tours.map((tour) => tour.id.toString()),
            ],
          },
        })
        .exec();
      userIds = bookings.map((b) => b.userId);
      filter._id = { $in: userIds };
    }

    if (query.email) {
      filter.email = { $regex: query.email, $options: "i" };
    }

    if (query.fullName) {
      filter.fullName = { $regex: query.fullName, $options: "i" };
    }

    const data = await this.userModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();

    const total = await this.userModel.countDocuments(filter).exec();

    return {
      data: data,
      total,
    };
  }

  async findUserById(id: any): Promise<User> {
    const user = await this.userModel.findById(id).select("-password").exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email: email }).exec();
    return user;
  }

  async updateUser(
    id: string,
    updateUserRequest: UpdateUserRequest
  ): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserRequest, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string
  ): Promise<string> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Old password is incorrect");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return "Update password successfully";
  }
}
