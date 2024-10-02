import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { BookingStatus } from "src/enums/booking.enum";

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop()
  userId: string;

  @Prop({ required: true })
  tourId: string;

  @Prop({ required: true })
  status: BookingStatus;

  @Prop({ required: true })
  guestSize: number;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
