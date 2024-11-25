import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type VerificationCodeDocument = VerificationCode & Document;

@Schema({ timestamps: true })
export class VerificationCode {
  @Prop({ type: Types.ObjectId, ref: "user", required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export const VerificationCodeSchema = SchemaFactory.createForClass(VerificationCode);
