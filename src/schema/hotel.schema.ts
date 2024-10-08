import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Address } from "src/payload/request/users.request";

@Schema({ timestamps: true })
export class Hotel extends Document {
  @Prop({ required: true })
  name: string;

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
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
