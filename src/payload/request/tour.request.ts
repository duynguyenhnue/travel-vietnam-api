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
  IsEnum,
} from "class-validator";
import { ObjectId, Types } from "mongoose";
import { TourStatus } from "src/enums/booking.enum";

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

export class ReplyReviewRequest {
  @IsString()
  @IsNotEmpty()
  reviewText: string; 

  @IsString()
  @IsOptional()
  userId?: string;
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
  @Matches(/^(1|[1-4][0-9]|50)$/, {
    message:
      "MaxGroupSize must be a string containing a number between '1' and '50'.",
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
  @Min(0)
  limit: number;

  @Type(() => Number)
  @Min(0)
  page: number;
}

export class SearchTourRequestDto extends GetTourRequestDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  departurePoint?: string;

  @IsString()
  @IsOptional()
  destination?: string;

  @IsOptional()
  groupSize?: number;

  @IsOptional()
  price?: number;

  @IsOptional()
  status?: TourStatus;
}

export class CreateReviewRequest {
  @IsString()
  @IsNotEmpty()
  reviewText: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  hotelId?: string;

  @IsString()
  @IsOptional()
  tourId?: string;

  @ValidateNested()
  @Type(() => ReplyReviewRequest)
  @IsOptional()
  reply?: ReplyReviewRequest;
}