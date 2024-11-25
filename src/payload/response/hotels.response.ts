import { Address } from "../request/users.request";
import { Review } from "src/schema/review.schema";

export class HotelResponseDto {
  name: string;

  address: Address;

  price: number;

  reviews: Review[];

  description: string;

  amenities: string[];

  photos: string[];

  startDate: Date;

  endDate: Date;
}
