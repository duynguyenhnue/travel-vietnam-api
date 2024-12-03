import { PartialType } from "@nestjs/mapped-types";
import {
  IsString,
  IsArray,
  IsOptional,
  Matches,
  IsEnum,
  IsNumber,
} from "class-validator";
import { ObjectId, isValidObjectId } from "mongoose";
import { RoomType } from "src/enums/room.enum";
import { searchHotelIdRequestDto } from "./hotels.request";
import { Type } from "class-transformer";
import { ParseObjectIdPipe } from "src/config/parse-objectId-pipe";

export class CreateRoomRequestDto {
  @IsString()
  readonly roomNumber: string;

  @IsNumber()
  readonly price: number;

  @IsString()
  readonly description: string;

  @IsString()
  @Matches(/^[0-9a-fA-F]{24}$/, {
    message: "Hotel ID must be a valid MongoDB ObjectId.",
  })
  readonly hotelId: ObjectId;

  @IsEnum(RoomType)
  readonly roomType: RoomType;

  @IsNumber()
  readonly maxOccupancy: number;
}

export class UpdateRoomRequestDto extends PartialType(CreateRoomRequestDto) {}

export class SearchRoomRequestDto extends searchHotelIdRequestDto {
  @IsString()
  @IsOptional()
  @Type(() => ParseObjectIdPipe)
  hotelId: ObjectId;

  @IsEnum(RoomType)
  @IsOptional()
  roomType: RoomType;

  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, { message: "Price must be a numeric string." })
  price: number;

  @IsOptional()
  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate: string;
}

export class SearchRoomsRequestDto {
  @IsString()
  @IsOptional()
  @Type(() => ParseObjectIdPipe)
  hotelId: ObjectId;

  @IsEnum(RoomType)
  @IsOptional()
  roomType: RoomType;

  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, { message: "Price must be a numeric string." })
  price: number;

  @IsOptional()
  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate: string;
}
