import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export type CategoryDocument = Category & mongoose.Document;

@Schema({ timestamps: true })
export class Category {
    @Prop({ required: true })
    name!: string;

    @Prop({ required: false, default: "" })
    description?: string;

    @Prop({ required: false, default: "" })
    slug?: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null,
    })
    parent?: ObjectId;

    @Prop({ required: false, default: false })
    isFeatured?: boolean;

    @Prop({ required: false })
    order?: number;

    @Prop({ required: false, default: "" })
    brand?: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
