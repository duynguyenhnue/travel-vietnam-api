import { TourStatus } from "src/enums/booking.enum";
import { Address } from "../request/users.request";
import { Review } from "src/schema/review.schema";

export class TourResponse {
  id: string;
  title: string;
  photos: string[];
  desc: string;
  price: number;
  maxGroupSize: number;
  hotelId: string;
  status: TourStatus;
  customerIds: string[];
  reviews: Review[];
  startDate: Date;
  endDate: Date;
  destination: Address;
  departurePoint: Address;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
