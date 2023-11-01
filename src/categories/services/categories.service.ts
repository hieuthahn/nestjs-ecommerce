import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Category, CategoryDocument } from "../schemas/category.schema";
import { Model, Types } from "mongoose";
import slugify from "slugify";
import { DeleteResult, ObjectId } from "mongodb";
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

    async findMany(
        page?: number,
        pageSize?: number
    ): Promise<PaginatedCategories> {
        const count = await this.categoryModel.countDocuments({});
        const hasPagination = page && pageSize;
        const categories = hasPagination
            ? await this.categoryModel
                  .find()
                  .limit(Number(pageSize))
                  .skip(Number(pageSize) * (Number(page) - 1))
            : await this.categoryModel.find();
        if (!categories.length)
            throw new NotFoundException("No categories found");
        return hasPagination
            ? {
                  categories: categories,
                  page: Number(page),
                  pageSize,
                  pages: Math.ceil(count / Number(pageSize)),
                  total: count,
              }
            : { categories };
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
