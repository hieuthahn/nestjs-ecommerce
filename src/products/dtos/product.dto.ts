import {
    IsString,
    IsNumber,
    IsArray,
    IsOptional,
    IsMongoId,
    ValidateNested,
    ArrayNotEmpty,
    IsNotEmpty,
    IsNotEmptyObject,
    IsBoolean,
    IsEnum,
} from "class-validator";
import { ObjectId } from "mongodb";
import { Attribute, ExternalLink, Image } from "../schemas/product.schema";
import { Type } from "class-transformer";

export class ProductDto {
    @IsString()
    name: string;

    @IsNumber()
    price: string;

    @IsString()
    @IsOptional()
    shortDescription: string;

    @IsString()
    @IsOptional()
    longDescription: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Image)
    images: Image[];

    @IsString()
    @IsOptional()
    brand: string;

    @IsMongoId()
    category: ObjectId;

    @IsBoolean()
    @IsOptional()
    isContactPrice: boolean;

    @IsNumber()
    stock: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExternalLink)
    externalLinks: ExternalLink[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Attribute)
    attributes: Attribute[];

    @IsArray()
    @IsOptional()
    tags: string[];
}
