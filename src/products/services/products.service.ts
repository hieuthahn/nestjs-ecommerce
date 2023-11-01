import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { PaginatedProducts } from "src/interfaces";
import { UserDocument } from "src/users/schemas/user.schema";
import { Product, ProductDocument } from "../schemas/product.schema";
import slugify from "slugify";
import { CategoriesService } from "src/categories/services/categories.service";

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        private categoriesService: CategoriesService
    ) {}

    async findTopRated(): Promise<ProductDocument[]> {
        const products = await this.productModel
            .find({})
            .sort({ rating: -1 })
            .limit(3);

        if (!products.length) throw new NotFoundException("No products found.");

        return products;
    }

    async findMany(
        keyword?: string,
        page?: number,
        pageSize?: number
    ): Promise<PaginatedProducts> {
        const rgex = keyword
            ? { name: { $regex: keyword, $options: "i" } }
            : {};
        const count = await this.productModel.countDocuments({ ...rgex });
        const products =
            page && pageSize
                ? await this.productModel
                      .find({ ...rgex })
                      .populate("category")
                      .limit(pageSize)
                      .skip(pageSize * (page - 1))
                : await this.productModel
                      .find({ ...rgex })
                      .populate("category");

        if (!products.length) throw new NotFoundException("No products found.");

        return page && pageSize
            ? {
                  products,
                  page,
                  pages: Math.ceil(count / pageSize),
                  pageSize: pageSize,
              }
            : {
                  products,
              };
    }

    async findById(id: string): Promise<ProductDocument> {
        if (!Types.ObjectId.isValid(id))
            throw new BadRequestException("Invalid product ID.");

        const product = await this.productModel.findById(id);

        if (!product) throw new NotFoundException("No product with given ID.");

        return product;
    }

    async createMany(
        products: Partial<ProductDocument>[]
    ): Promise<ProductDocument[]> {
        const createdProducts = await this.productModel.insertMany(products);

        return createdProducts;
    }

    async create(product: Partial<ProductDocument>): Promise<ProductDocument> {
        product.slug = slugify(product.name, {
            lower: true,
        });
        const existingCategory = await this.categoriesService.findById(
            product.category.toString()
        );

        if (!existingCategory) {
            throw new BadRequestException("Category does not exists");
        }

        const existingProduct = await this.productModel.findOne({
            slug: product.slug,
        });
        if (existingProduct) {
            throw new BadRequestException("Product name already exists");
        }

        if (product.tags?.length > 0) {
            product.tags = product.tags.filter((tag) =>
                ["new", "feature", "best_selling", "flash_sale"].includes(tag)
            );
        }

        const createdProduct = await this.productModel.create(product);

        return createdProduct;
    }

    async update(
        id: string,
        attrs: Partial<ProductDocument>
    ): Promise<ProductDocument> {
        if (!Types.ObjectId.isValid(id))
            throw new BadRequestException("Invalid product ID.");

        const product = await this.productModel.findById(id);

        if (!product) throw new NotFoundException("No product with given ID.");

        if (attrs.category) {
            const existingCategory = await this.categoriesService.findById(
                attrs.category.toString()
            );

            if (!existingCategory) {
                throw new BadRequestException("Category does not exists");
            }
        }

        if (attrs.name) {
            attrs.slug = slugify(attrs.name, {
                lower: true,
            });
            const existingProduct = await this.productModel.findOne({
                slug: { $in: attrs.slug, $nin: product.slug },
            });
            if (existingProduct) {
                throw new BadRequestException("Product name already exists");
            }
        }

        if (attrs.tags?.length > 0) {
            attrs.tags = attrs.tags.filter((tag) =>
                ["new", "feature", "best_selling", "flash_sale"].includes(tag)
            );
        }

        Object.entries(attrs).forEach(([key, value]) => {
            product[key] = value;
        });

        const updatedProduct = await product.save();

        return updatedProduct;
    }

    async createReview(
        id: string,
        user: Partial<UserDocument>,
        rating: number,
        comment: string
    ): Promise<ProductDocument> {
        if (!Types.ObjectId.isValid(id))
            throw new BadRequestException("Invalid product ID.");

        const product = await this.productModel.findById(id);

        if (!product) throw new NotFoundException("No product with given ID.");

        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === user._id.toString()
        );

        if (alreadyReviewed)
            throw new BadRequestException("Product already reviewed!");

        const review = {
            name: user.fullName,
            rating,
            comment,
            user: user._id,
        };

        product.reviews.push(review);

        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        product.numReviews = product.reviews.length;

        const updatedProduct = await product.save();

        return updatedProduct;
    }

    async deleteOne(id: string): Promise<void> {
        if (!Types.ObjectId.isValid(id))
            throw new BadRequestException("Invalid product ID.");

        const product = await this.productModel.findById(id);

        if (!product) throw new NotFoundException("No product with given ID.");

        await product.remove();
    }

    async deleteMany(): Promise<void> {
        await this.productModel.deleteMany({});
    }
}
