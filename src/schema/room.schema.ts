import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { RoomType } from "src/enums/room.enum";

@Schema({ timestamps: true })
export class Room extends Document {
  @Prop({ required: true })
  roomNumber: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  roomType: RoomType;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  maxOccupancy: number;

  @Prop([String])
  amenities: string[];

  @Prop([String])
  images: string[];

  @Prop({ required: true })
  hotelId: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
