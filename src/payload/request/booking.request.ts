import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  IsEnum,
  IsOptional,
} from "class-validator";
import { BookingStatus, BookingType } from "src/enums/booking.enum";

export class CreateBookingRequest {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsOptional()
  roomId: string;

  @IsOptional()
  startDate: string;

  @IsOptional()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  vnpayCode: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(BookingType)
  bookingType: BookingType;

  @IsNumber()
  @Min(1)
  guestSize: number;
}

export class GetBookingRequestDto {
  @Type(() => Number)
  @Min(0)
  limit: number;

  @Type(() => Number)
  @Min(0)
  page: number;
}

export class SearchBookingRequestDto extends GetBookingRequestDto {
  amount?: number;

  bookingType?: BookingType;

  @IsOptional()
  status?: BookingStatus;
}
