import { IsNotEmpty, IsString, IsNumber, Min, IsEnum } from "class-validator";
import { BookingType } from "src/enums/booking.enum";

export class CreateBookingRequest {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  tourId: string;

  @IsEnum(BookingType)
  bookingType: BookingType;

  @IsNumber()
  @Min(1)
  guestSize: number;
}
