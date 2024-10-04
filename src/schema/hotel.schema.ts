import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Hotel extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  rating: number;

  @Prop()
  description: string;

  @Prop([String])
  amenities: string[];

  @Prop([String])
  images: string[];

  @Prop()
  checkInPolicy: string;

  @Prop()
  checkOutPolicy: string;

  @Prop()
  cancellationPolicy: string;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
