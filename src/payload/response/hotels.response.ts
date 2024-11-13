import { Exclude, Expose } from "class-transformer";
import { Types } from "mongoose";
import { Address } from "../request/users.request";

export class HotelResponseDto {
  name: string;

  address: Address;

  price: number;

  reviews: Types.ObjectId[];

  description: string;

  amenities: string[];

  photos: string[];

  startDate: Date;

  endDate: Date;
}
