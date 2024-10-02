import { IsNotEmpty, IsString, IsNumber, Min } from "class-validator";

export class CreateBookingRequest {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  tourId: string;

  @IsNumber()
  @Min(1)
  guestSize: number;
}
