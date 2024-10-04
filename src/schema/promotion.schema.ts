import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Booking } from "./booking.schema";

@Schema()
export class Promotion extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  discount: number;

  @Prop({ required: true, unique: true })
  promotionCode: string;

  @Prop({ required: true, unique: true })
  bookings: String[];
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
