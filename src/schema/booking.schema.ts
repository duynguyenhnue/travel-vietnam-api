import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Room } from "./room.schema";

@Schema()
export class Booking extends Document {
  @Prop({ required: true })
  booking_date: Date;

  @Prop({ required: true })
  check_in: Date;

  @Prop({ required: true })
  check_out: Date;

  @Prop({ required: true })
  customer: String;

  @Prop({ required: true })
  roomId: String;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
