import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import {
  IsString,
  IsArray,
  IsOptional,
  Matches,
  Min,
  IsNotEmpty,
  ValidateNested,
  IsDateString,
} from "class-validator";
import { Address } from "./users.request";
import { HotelStatus } from "src/enums/booking.enum";

export class GetHotelRequestDto {
  @Type(() => Number)
  @Min(0)
  limit: number;

  @Type(() => Number)
  @Min(0)
  page: number;
}

export class CreateHotelRequestDto {
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => Address)
  address: Address;

  @IsString()
  description: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  amenities: string[];

  @Matches(/^\d+$/, { message: "Price must be a numeric string." })
  @IsString()
  price: number;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;
}

export class UpdateHotelRequestDto extends PartialType(CreateHotelRequestDto) {
  @IsArray()
  @IsString({ each: true })
  photos: string[];
}

export class searchHotelIdRequestDto {
  @IsString()
  @IsOptional()
  search?: string;

  @Type(() => Number)
  @Min(5)
  limit: number;

  @Type(() => Number)
  @Min(0)
  page: number;
}

export class SearchHotelsRequestDto extends GetHotelRequestDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsOptional()
  maxGroupSize?: number;

  @IsOptional()
  price?: number;

  @IsOptional()
  status?: HotelStatus;
}
