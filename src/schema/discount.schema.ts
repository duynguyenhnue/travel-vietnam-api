import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { DiscountStatus, DiscountType } from "src/enums/discount.enum";

export type DiscountDocument = Discount & Document;

@Schema({ timestamps: true })
export class Discount extends Document {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  value: number; 

  @Prop({ required: true })
  type: DiscountType;

  @Prop({ required: false })
  min_order_value: number; 

  @Prop({ required: false })
  max_discount_value: number; 

  @Prop({ required: true })
  startDate: Date; 

  @Prop({ required: true })
  endDate: Date; 

  @Prop({ required: false })
  usage_limit: number;

  @Prop({ required: false })
  used_count: number; 
  @Prop({ required: false })
  status: DiscountStatus; 
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);
