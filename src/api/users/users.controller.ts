import {
  Controller,
  Body,
  Get,
  Param,
  Put,
  Delete,
  InternalServerErrorException,
  NotFoundException,
  HttpStatus,
  Req,
  Query,
} from "@nestjs/common";
import { UserService } from "./users.service";
import { User } from "../../schema/user.schema";
import {
  SearchUserRequest,
  UpdateUserRequest,
} from "../../payload/request/users.request";
import { CommonException } from "../../common/exception/common.exception";
import { successResponse } from "../../common/dto/response.dto";
import { AUTH_PERMISSIONS } from "src/enums/auth.enum";
import { AuthJwtAccessProtected } from "src/common/guards/role.guard";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@Req() req) {
    try {
      return successResponse(await this.userService.getUser(req.user));
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("search")
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.CUSTOMER_VIEW)
  async search(@Query() query: SearchUserRequest) {
    try {
      return successResponse(await this.userService.searchUsers(query));
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(":id")
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.CUSTOMER_UPDATE)
  async updateUser(
    @Param("id") id: string,
    @Body() updateUserRequest: UpdateUserRequest
  ): Promise<User> {
    try {
      const user = await this.userService.updateUser(id, updateUserRequest);
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to update user");
    }
  }

  @Delete(":id")
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.CUSTOMER_DELETE)
  async deleteUser(@Param("id") id: string): Promise<void> {
    try {
      await this.userService.deleteUser(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to delete user");
    }
  }
}
