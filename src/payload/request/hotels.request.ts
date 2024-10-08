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
  IsNotEmpty,
  ValidateNested,
} from "class-validator";
import { Address } from "./users.request";

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
