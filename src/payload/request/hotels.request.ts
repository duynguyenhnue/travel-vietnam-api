import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  IS_LENGTH,
  Length,
  Matches,
  Min,
  IsInt,
} from "class-validator";

export class CreateHotelRequestDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  @Matches(/^(1(\.0)?|2(\.[0-9])?|3(\.[0-9])?|4(\.[0-9])?|5(\.0)?)$/, {
    message: "Rating must be a string between '1.0' and '5.0'",
  })
  rating: string;

  @IsString()
  description: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  amenities: string[];

  @IsOptional()
  @IsString()
  checkInPolicy: string;

  @IsOptional()
  @IsString()
  checkOutPolicy: string;

  @IsOptional()
  @IsString()
  cancellationPolic: string;
}

export class UpdateHotelRequestDto extends PartialType(CreateHotelRequestDto) {
  @IsArray()
  @IsString({ each: true })
  images: string[];
}

export class searchHotelIdRequestDto {
  @IsString()
  @IsOptional()
  search?: string;

  @Type(() => Number)
  @Min(6)
  limit: number;

  @Type(() => Number)
  @Min(0)
  page: number;
}
