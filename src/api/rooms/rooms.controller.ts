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
  SearchRoomsRequestDto,
  UpdateRoomRequestDto,
} from "src/payload/request/rooms.request";
import { FilesInterceptor } from "@nestjs/platform-express";
import { SkipAuth } from "src/config/skip.auth";
import { ObjectId } from "mongoose";
import { ParseObjectIdPipe } from "src/config/parse-objectId-pipe";
import { CommonException } from "src/common/exception/common.exception";
import { successResponse } from "src/common/dto/response.dto";
import { AuthJwtAccessProtected } from "src/common/guards/role.guard";
import { AUTH_PERMISSIONS } from "src/enums/auth.enum";

@Controller("rooms")
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor("files"))
  // @AuthJwtAccessProtected(AUTH_PERMISSIONS.ROOM_CREATE)
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
  async searchRoomsByHotel(@Query() query: SearchRoomsRequestDto) {
    try {
      return successResponse(await this.roomsService.searchRooms(query));
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("get-one/:id")
  @SkipAuth()
  async findOne(@Param("id") id: string) {
    try {
      return successResponse(await this.roomsService.findOne(id));
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
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.ROOM_UPDATE)
  async update(
    @Param("id") id: string,
    @Body() updateRoomDto: UpdateRoomRequestDto
  ) {
    try {
      console.log(id);
      console.log(updateRoomDto);
      return successResponse(await this.roomsService.update(id, updateRoomDto));
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(":id")
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.ROOM_DELETE)
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
