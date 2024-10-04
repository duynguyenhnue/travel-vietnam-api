import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: "tour", required: true })
  tourId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "user", required: true })
  userId: string;

  @Prop({ required: true })
  reviewText: string;

  @Prop({ required: true, min: 0, max: 5, default: 0 })
  rating: number;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
