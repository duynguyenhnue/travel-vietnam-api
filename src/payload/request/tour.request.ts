import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsMongoId,
  Min,
  Max,
  Length,
  Matches,
  IsDate,
  IsDateString,
  ValidateNested,
} from "class-validator";
import { ObjectId, Types } from "mongoose";

class Address {
  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  ward: string;
}

export class CreateTourDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  title: string;

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

  @IsMongoId()
  @IsNotEmpty()
  hotelId: ObjectId;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @ValidateNested()
  @Type(() => Address)
  destination: Address;

  @ValidateNested()
  @Type(() => Address)
  departurePoint: Address;
}

export class UpdateTourDto extends PartialType(CreateTourDto) {
  @IsNotEmpty()
  photos: string[];
}

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
  title?: string;

  @IsOptional()
  @Matches(/^(?:[1-9]|[1-4][0-9]|50)$/, {
    message:
      "MaxGroupSize must be a string containing a number between '1' and '50'.",
  })
  groupSize?: number;
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
