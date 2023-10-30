import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Category, CategoryDocument } from "../schemas/category.schema";
import { Model, Types } from "mongoose";
import slugify from "slugify";
import { DeleteResult } from "mongodb";
import { PaginatedCategories } from "src/interfaces";

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category.name)
        private categoryModel: Model<CategoryDocument>
    ) {}

    async create(
        category: Partial<CategoryDocument>
    ): Promise<CategoryDocument> {
        category.slug = slugify(category.name);
        const existingCategory = await this.categoryModel.findOne({
            name: category.name,
        });
        if (existingCategory)
            throw new BadRequestException(
                `Category ${category.name} already exists`
            );

        const createdCategory = await this.categoryModel.create(category);

        return createdCategory;
    }

    async findAll(
        page?: number,
        pageSize?: number
    ): Promise<PaginatedCategories> {
        const count = await this.categoryModel.countDocuments({});
        if (page && pageSize) {
            const categories = await this.categoryModel
                .find()
                .populate("parent")
                .limit(Number(pageSize))
                .skip(Number(pageSize) * (Number(page) - 1));
            if (!categories.length)
                throw new NotFoundException("No categories found");
            return {
                categories,
                page: Number(page),
                pageSize,
                pages: Math.ceil(count / Number(pageSize)),
                total: count,
            };
        } else {
            const categories = await this.categoryModel
                .find()
                .populate("parent");
            return { categories };
        }
    }

    async findById(id: string): Promise<CategoryDocument> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException("Invalid category ID.");
        }

        const category = this.categoryModel.findById(id);

        if (!category) {
            throw new NotFoundException("Category not found");
        }

        return category;
    }

    async update(
        id: string,
        attrs: Partial<CategoryDocument>
    ): Promise<CategoryDocument> {
        if (!Types.ObjectId.isValid(id))
            throw new BadRequestException("Invalid category ID.");

        const category = await this.categoryModel.findById(id);

        if (!category) throw new BadRequestException("Category not found");

        const existingCategory = await this.categoryModel.findOne({
            name: { $in: attrs.name, $nin: category.name },
        });

        if (
            existingCategory &&
            existingCategory.name === attrs.name &&
            attrs.name !== category.name
        ) {
            throw new BadRequestException("Category name already exists");
        }

        attrs.slug = slugify(attrs.name);
        Object.entries(attrs).forEach(([key, value]) => {
            if (value) category[key] = value;
        });

        const updatedCategory = await category.save();
        return updatedCategory;
    }

    async deleteOne(id: string): Promise<void> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException("Invalid category ID.");
        }

        const category = await this.categoryModel.findById(id);
        if (!category) throw new BadRequestException("Category not found");

        await category.remove();
    }

    async deleteMany(): Promise<DeleteResult> {
        return await this.categoryModel.deleteMany({});
    }
}
