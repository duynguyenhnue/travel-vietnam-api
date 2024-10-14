import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Status } from "../enums/role.enum";

@Schema({
  collection: "roles",
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class Role extends Document {
  @Prop({ unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [String] })
  permissions: string[];

  @Prop({
    type: String,
    enum: Object.values(Status),
    default: Status.INACTIVATED,
  })
  status: Status;

  @Prop({ default: Date.now })
  createdAt: number;

  @Prop({ default: Date.now })
  updatedAt: number;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

export type RoleDocument = Role & Document;
