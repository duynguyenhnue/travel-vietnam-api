import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop()
  userId: string;

  @Prop({ required: true })
  tourId: string;

  @Prop({ required: true })
  guestSize: number;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
