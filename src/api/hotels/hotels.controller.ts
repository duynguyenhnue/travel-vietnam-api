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
import { HotelResponseDto } from "src/payload/response/hotels.response";
import { SkipAuth } from "src/config/skip.auth";
import { FileUploadInterceptor } from "../firebase/file.interceptor";
import { CommonException } from "src/common/exception/common.exception";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ObjectId } from "mongoose";
import { successResponse } from "src/common/dto/response.dto";

@Controller("hotels")
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  @SkipAuth()
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

  @Get()
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

  @SkipAuth()
  @Put(":id")
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

  @SkipAuth()
  @Delete(":id")
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
