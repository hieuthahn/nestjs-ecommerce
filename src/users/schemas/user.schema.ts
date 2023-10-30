import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true, id: true })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false, unique: true, default: "" })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false, default: "" })
  address?: string;

  @Prop({ required: false, default: "" })
  shippingAddress?: string;

  @Prop({ required: true, default: ["customer"] })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
