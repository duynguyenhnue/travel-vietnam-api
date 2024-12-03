import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { RoomType } from "src/enums/room.enum";

@Schema({ timestamps: true })
export class Room extends Document {
  @Prop({ required: true })
  roomNumber: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  roomType: RoomType;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  maxOccupancy: number;

  @Prop({ required: true })
  hotelId: string;

  @Prop({ default: false })
  status: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
