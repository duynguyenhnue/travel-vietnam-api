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
  UpdateUserRequest,
} from "../../payload/request/users.request";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

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

  async findUserById(id: any): Promise<User> {
    const user = await this.userModel.findById(id).exec();

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
}
