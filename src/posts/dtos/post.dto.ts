import {
    IsArray,
    IsBoolean,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
} from "class-validator";
import { ObjectId } from "mongodb";

export class PostDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsBoolean()
    @IsOptional()
    isFeatured: boolean;

    @IsNumber()
    @IsOptional()
    order: number;

    @IsString()
    @IsOptional()
    slug: string;
}
