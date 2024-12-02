import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Address } from "src/payload/request/users.request";
import { Review } from "./review.schema";

export type HotelDocument = Hotel & Document;

@Schema({ timestamps: true })
export class Hotel extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  address: Address;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: "review" }] })
  reviews: Types.ObjectId[];

  @Prop()
  description: string;

  @Prop([String])
  amenities: string[];

  @Prop([String])
  photos: string[];

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
