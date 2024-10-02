import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsMongoId,
  Min,
  Max,
  Length,
  Matches,
} from "class-validator";
import { Types } from "mongoose";

export class CreateTourDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  city: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 200)
  address: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 1000)
  desc: string;

  @IsNotEmpty()
  @Matches(/^\d+$/, { message: "Price must be a numeric string." })
  price: number;

  @IsNotEmpty()
  @Matches(/^[1-9]$/, {
    message:
      "MaxGroupSize must be a string containing a number between '1' and '9'.",
  })
  maxGroupSize: number;

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  reviews?: Types.ObjectId[];

  @IsBoolean()
  @IsOptional()
  featured?: boolean;
}

export class UpdateTourDto extends PartialType(CreateTourDto) {}

export class GetTourRequestDto {
  @Type(() => Number)
  @Min(9)
  limit: number;

  @Type(() => Number)
  @Min(0)
  page: number;
}

export class SearchTourRequestDto extends GetTourRequestDto {
  @IsString()
  @IsOptional()
  @Length(2, 100)
  city: string;

  @IsOptional()
  @Matches(/^[1-9]$/, {
    message:
      "MaxGroupSize must be a string containing a number between '1' and '9'.",
  })
  groupSize: number;
}

export class CreateReviewRequest {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  reviewText: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;
}
