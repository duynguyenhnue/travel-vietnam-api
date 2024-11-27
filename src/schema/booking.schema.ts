import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { BookingStatus, BookingType } from "src/enums/booking.enum";

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop()
  userId: string;

  @Prop({ required: true })
  orderId: string;

  @Prop({ default: null })
  roomId: string;

  @Prop({ default: null })
  startDate: Date;

  @Prop({ default: null })
  endDate: Date;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  vnpayCode: string;

  @Prop({ required: true })
  status: BookingStatus;

  @Prop({ required: true })
  bookingType: BookingType;

  @Prop({ required: true })
  guestSize: number;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
