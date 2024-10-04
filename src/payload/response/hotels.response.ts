import { Exclude, Expose } from "class-transformer";

export class HotelResponseDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly address: string;

  @Expose()
  readonly rating: number;

  @Expose()
  readonly description: string;

  @Expose()
  readonly amenities: string[];

  @Expose()
  readonly images: string[];

  @Expose()
  readonly checkInPolicy: string;

  @Expose()
  readonly checkOutPolicy: string;

  @Expose()
  readonly cancellationPolicy: string;

  @Exclude()
  private readonly createdAt: Date;

  @Exclude()
  private readonly updatedAt: Date;
}
