import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Query,
  HttpStatus,
} from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import {
  CreateRoomRequestDto,
  SearchRoomRequestDto,
  UpdateRoomRequestDto,
} from "src/payload/request/rooms.request";
import { RoomResponseDto } from "src/payload/response/room.response";
import { FilesInterceptor } from "@nestjs/platform-express";
import { SkipAuth } from "src/config/skip.auth";
import { ObjectId } from "mongoose";
import { ParseObjectIdPipe } from "src/config/parse-objectId-pipe";
import { CommonException } from "src/common/exception/common.exception";
import { successResponse } from "src/common/dto/response.dto";

@Controller("rooms")
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @SkipAuth()
  @UseInterceptors(FilesInterceptor("files"))
  async create(
    @Body() createRoomDto: CreateRoomRequestDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    try {
      return successResponse(
        await this.roomsService.create(createRoomDto, files)
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
  async searchRoomsByHotel(@Query() query: SearchRoomRequestDto) {
    try {
      return successResponse(await this.roomsService.searchRoomsByHotel(query));
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":hotelId/:roomId")
  @SkipAuth()
  async findRoomByHotelId(
    @Param("hotelId", ParseObjectIdPipe) hotelId: ObjectId,
    @Param("roomId", ParseObjectIdPipe) roomId: ObjectId
  ) {
    try {
      return successResponse(
        await this.roomsService.findRoomByHotelId(hotelId, roomId)
      );
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(":id")
  @SkipAuth()
  async update(
    @Param("id") id: string,
    @Body() updateRoomDto: UpdateRoomRequestDto
  ) {
    try {
      return successResponse(await this.roomsService.update(id, updateRoomDto));
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(":id")
  @SkipAuth()
  async delete(@Param("id") id: string) {
    try {
      return successResponse(await this.roomsService.delete(id));
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
