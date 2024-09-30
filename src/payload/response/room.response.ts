import { Exclude, Expose } from "class-transformer";

export class RoomResponseDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly roomNumber: string;

  @Expose()
  readonly price: number;

  @Expose()
  readonly available: boolean;

  @Expose()
  readonly bedType: string;

  @Expose()
  readonly amenities: string[];

  @Expose()
  readonly images: string[];

  @Expose()
  readonly hotelId: string;
}
