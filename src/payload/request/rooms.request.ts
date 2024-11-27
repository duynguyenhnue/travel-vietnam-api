import { PartialType } from "@nestjs/mapped-types";
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsOptional,
  Matches,
  IsInt,
  Min,
  Max,
  IsEnum,
} from "class-validator";
import { ObjectId, isValidObjectId } from "mongoose";
import { RoomType } from "src/enums/room.enum";
import { searchHotelIdRequestDto } from "./hotels.request";
import { Type } from "class-transformer";
import { ParseObjectIdPipe } from "src/config/parse-objectId-pipe";

export class CreateRoomRequestDto {
  @IsString()
  readonly roomNumber: string;

  @IsString()
  @Matches(/^\d+$/, { message: "Price must be a numeric string." })
  readonly price: number;

  @IsString()
  readonly description: string;

  @IsArray()
  @IsString({ each: true })
  readonly amenities: string[];

  @IsString()
  @Matches(/^[0-9a-fA-F]{24}$/, {
    message: "Hotel ID must be a valid MongoDB ObjectId.",
  })
  readonly hotelId: ObjectId;

  @IsEnum(RoomType)
  readonly roomType: RoomType;

  @IsString()
  @Matches(/^[1-4]$/, {
    message:
      "Occupancy must be a string containing an integer between 1 and 4.",
  })
  readonly maxOccupancy: number;
}

export class UpdateRoomRequestDto extends PartialType(CreateRoomRequestDto) {
  @IsArray()
  @IsString({ each: true })
  readonly images?: string[];
}

export class SearchRoomRequestDto extends searchHotelIdRequestDto {
  @IsString()
  @Type(() => ParseObjectIdPipe)
  hotelId: ObjectId;

  @IsEnum(RoomType)
  @IsOptional()
  roomType: RoomType;

  @IsString()
  @Matches(/^[1-6]$/, {
    message:
      "Occupancy must be a string containing an integer between 1 and 6.",
  })
  @IsOptional()
  maxOccupancy: number;

  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, { message: "Price must be a numeric string." })
  price: number;
}
