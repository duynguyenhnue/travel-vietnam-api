import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UploadedFiles,
  UseInterceptors,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { HotelsService } from "./hotels.service";
import {
  CreateHotelRequestDto,
  UpdateHotelRequestDto,
  searchHotelIdRequestDto,
} from "src/payload/request/hotels.request";
import { SkipAuth } from "src/config/skip.auth";
import { CommonException } from "src/common/exception/common.exception";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ObjectId } from "mongoose";
import { successResponse } from "src/common/dto/response.dto";
import { AuthJwtAccessProtected } from "src/common/guards/role.guard";
import { AUTH_PERMISSIONS } from "src/enums/auth.enum";

@Controller("hotels")
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.HOTEL_CREATE)
  @UseInterceptors(FilesInterceptor("files"))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createHotelDto: CreateHotelRequestDto
  ) {
    try {
      return successResponse(
        await this.hotelsService.create(createHotelDto, files)
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
  async searchHotel(@Query() query: searchHotelIdRequestDto) {
    return successResponse(await this.hotelsService.searchHotel(query));
  }

  @Get(":id")
  @SkipAuth()
  async findOne(@Param("id") id: ObjectId) {
    try {
      return successResponse(await this.hotelsService.findOne(id));
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(":id")
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.HOTEL_UPDATE)
  @UseInterceptors(FilesInterceptor("files"))
  async update(
    @Param("id") id: ObjectId,
    @Body() updateHotelDto: UpdateHotelRequestDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    try {
      return successResponse(
        await this.hotelsService.update(id, updateHotelDto, files)
      );
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(":id")
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.HOTEL_DELETE)
  async delete(@Param("id") id: ObjectId) {
    try {
      return successResponse(await this.hotelsService.delete(id));
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
