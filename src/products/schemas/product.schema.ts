import * as mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "../../users/schemas/user.schema";
import { Category } from "src/categories/schemas/category.schema";
import { ObjectId } from "mongodb";
import { IsOptional, IsString, IsUrl } from "class-validator";

export type ProductDocument = Product & mongoose.Document;

@Schema({ timestamps: true })
export class Review {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        default: null,
    })
    user: User;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    rating: number;

    @Prop({ required: true })
    comment: string;
}

export class Attribute {
    @IsString()
    key: string;

    @IsString()
    value: number;

    @IsString()
    slug?: string;
}

export class ExternalLink {
    @IsString()
    title: string;

    @IsString()
    link: string;

    @IsString()
    type: string;
}

export class Image {
    @IsString()
    id: string;

    @IsString()
    @IsUrl()
    url: string;

    @IsString()
    @IsOptional()
    name?: string;
}

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true })
    name: string;

    @Prop({ require: true, default: "" })
    slug: string;

    @Prop({ default: "" })
    brand: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    })
    category: ObjectId;

    @Prop({ require: true, default: [] })
    images: Image[];

    @Prop({ default: "" })
    shortDescription: string;

    @Prop({ default: "" })
    longDescription: string;

    @Prop({ default: [] })
    reviews: Review[];

    @Prop({ default: 0 })
    numReviews: number;

    @Prop({ default: 0 })
    rating: number;

    @Prop({ required: true, default: 0 })
    price: string;

    @Prop({ required: true, default: 0 })
    stock: number;

    @Prop({ required: true, default: 0 })
    countInStock: number;

    @Prop({ default: [] })
    externalLinks: ExternalLink[];

    @Prop({ default: [] })
    attributes: Attribute[];

    @Prop({ default: false })
    isContactPrice: boolean;

    @Prop({ default: [] })
    tags: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
