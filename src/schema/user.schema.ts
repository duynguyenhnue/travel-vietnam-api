import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
class Address {
  @Prop({ required: true })
  province: string;

  @Prop({ required: true })
  district: string;

  @Prop({ required: true })
  ward: string;
}

@Schema()
class Phone {
  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  number: string;
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: null })
  avatar: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ type: Address, required: true })
  address: Address;

  @Prop({ type: Phone, required: true })
  phone: Phone;

  @Prop({ default: "USER" })
  role: string;

  @Prop({ default: "ACTIVE" })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
