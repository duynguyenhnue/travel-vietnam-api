import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type TourDocument = Tour & Document;

@Schema({ timestamps: true })
export class Tour {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  photo: string;

  @Prop({ required: true })
  desc: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  maxGroupSize: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Review" }] })
  reviews: Types.ObjectId[];

  @Prop({ default: false })
  featured: boolean;
}

export const TourSchema = SchemaFactory.createForClass(Tour);
