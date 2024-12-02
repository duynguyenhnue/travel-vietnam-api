import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { TourStatus } from "src/enums/booking.enum";

export type TourDocument = Tour & Document;

class Address {
  @Prop({ required: true })
  province: string;

  @Prop({ required: true })
  district: string;

  @Prop({ required: true })
  ward: string;
}

@Schema({ timestamps: true })
export class Tour {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  photos: string[];

  @Prop({ required: true })
  desc: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  maxGroupSize: number;

  @Prop({ type: Types.ObjectId, ref: "hotels", required: true })
  hotelId: Types.ObjectId;

  @Prop({ required: true, default: TourStatus.PENDING })
  status: TourStatus;

  @Prop({ type: [{ type: Types.ObjectId, ref: "users" }] })
  customerIds: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: "review" }] })
  reviews: Types.ObjectId[];

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: Address, required: true })
  destination: Address;

  @Prop({ type: Address, required: true })
  departurePoint: Address;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isCancel: boolean;
}

export const TourSchema = SchemaFactory.createForClass(Tour);
