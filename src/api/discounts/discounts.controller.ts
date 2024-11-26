import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { DiscountService } from "./discounts.service";
import { SkipAuth } from "src/config/skip.auth";
import { CommonException } from "src/common/exception/common.exception";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ObjectId } from "mongoose";
import { successResponse } from "src/common/dto/response.dto";
import { AuthJwtAccessProtected } from "src/common/guards/role.guard";
import { AUTH_PERMISSIONS } from "src/enums/auth.enum";
import { CreateDiscountRequestDto, SearchDiscountRequestDto, UpdateDiscountRequestDto } from "src/payload/request/discounts.request";

@Controller("discounts")
export class DiscountController {
  constructor(private readonly discountService: DiscountService) { }

  @Post()
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.DISCOUNT_CREATE)
  async create(
    @Body() createDiscountDto: CreateDiscountRequestDto
  ) {
    try {
      return successResponse(
        await this.discountService.create(createDiscountDto)
      );
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("/search")
  @SkipAuth()
  async searchDiscount(@Query() query: SearchDiscountRequestDto) {
    return successResponse(await this.discountService.getDiscountBySearch(query));
  }

  @Get(":id")
  @SkipAuth()
  async findOne(@Param("id") id: ObjectId) {
    try {
      return successResponse(await this.discountService.findOne(id));
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(":id")
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.DISCOUNT_UPDATE)
  @UseInterceptors(FilesInterceptor("files"))
  async update(
    @Param("id") id: ObjectId,
    @Body() updateDiscountDto: UpdateDiscountRequestDto,
  ) {
    try {
      return successResponse(
        await this.discountService.update(id, updateDiscountDto)
      );
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(":id")
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.DISCOUNT_DELETE)
  async delete(@Param("id") id: ObjectId) {
    try {
      return successResponse(await this.discountService.delete(id));
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
