import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import {
  IsString,
  IsOptional,
  Min,
  IsNotEmpty,
  IsDateString,
  IsEnum,
} from "class-validator";
import { DiscountType } from "src/enums/discount.enum";

export class GetDiscountRequestDto {
  @Type(() => Number)
  @Min(0)
  limit: number;

  @Type(() => Number)
  @Min(0)
  page: number;
}

export class CreateDiscountRequestDto {
  @IsString()
  code: string;

  @IsString()
  description: string;

  @IsEnum(DiscountType)
  type: DiscountType;

  @Type(() => Number)
  @Min(0)
  value: number;

  @Type(() => Number)
  @IsOptional()
  min_order_value?: number;

  @Type(() => Number)
  @IsOptional()
  max_discount_value?: number;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;
}

export class UpdateDiscountRequestDto extends PartialType(CreateDiscountRequestDto) {
  @IsOptional()
  @Type(() => Number)
  usage_limit?: number;

  @IsOptional()
  @Type(() => Number)
  used_count?: number;

  @IsOptional()
  status?: boolean;
}

export class searchDiscountIdRequestDto {
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

export class SearchDiscountRequestDto extends GetDiscountRequestDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsOptional()
  type?: DiscountType;

  @IsOptional()
  value?: number;
}
