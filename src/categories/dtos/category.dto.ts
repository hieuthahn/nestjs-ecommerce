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

export class CategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string | null;

    @IsBoolean()
    @IsOptional()
    isFeatured: boolean;

    @IsNumber()
    @IsOptional()
    order: number;

    @IsString()
    @IsOptional()
    brand: string;

    @IsMongoId()
    @IsOptional()
    parent: ObjectId | null;
}
