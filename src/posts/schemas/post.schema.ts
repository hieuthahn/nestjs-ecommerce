import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type PostDocument = Post & mongoose.Document;

@Schema({ timestamps: true })
export class Post {
    @Prop({ required: true })
    title: string;

    @Prop({ required: false, default: "" })
    content?: string;

    @Prop({ required: false, default: "" })
    slug?: string;

    @Prop({ required: false, default: false })
    isFeatured?: boolean;

    @Prop({ required: false })
    order?: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
