import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Post, PostDocument } from "../schemas/post.schema";
import { Model, Types } from "mongoose";
import slugify from "slugify";
import { DeleteResult, ObjectId } from "mongodb";
import { PaginatedPosts } from "src/interfaces";

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name)
        private postModel: Model<PostDocument>
    ) {}

    async create(post: Partial<PostDocument>): Promise<PostDocument> {
        post.slug = slugify(post.title);
        const existingPost = await this.postModel.findOne({
            slug: post.slug,
            title: post.title,
        });
        if (existingPost)
            throw new BadRequestException(`Post ${post.title} already exists`);

        const createdPost = await this.postModel.create(post);

        return createdPost;
    }

    async findMany(page?: number, pageSize?: number): Promise<PaginatedPosts> {
        const count = await this.postModel.countDocuments({});
        const hasPagination = page && pageSize;
        const posts = hasPagination
            ? await this.postModel
                  .find()
                  .limit(Number(pageSize))
                  .skip(Number(pageSize) * (Number(page) - 1))
            : await this.postModel.find();
        if (!posts.length) throw new NotFoundException("No posts found");
        return hasPagination
            ? {
                  posts: posts,
                  page: Number(page),
                  pageSize,
                  pages: Math.ceil(count / Number(pageSize)),
                  total: count,
              }
            : { posts };
    }

    async findById(id: string): Promise<PostDocument> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException("Invalid post ID.");
        }

        const post = this.postModel.findById(id);

        if (!post) {
            throw new NotFoundException("Post not found");
        }

        return post;
    }

    async update(
        id: string,
        attrs: Partial<PostDocument>
    ): Promise<PostDocument> {
        if (!Types.ObjectId.isValid(id))
            throw new BadRequestException("Invalid post ID.");

        const post = await this.postModel.findById(id);

        if (!post) throw new BadRequestException("Post not found");

        const existingPost = await this.postModel.findOne({
            title: { $in: attrs.title, $nin: post.title },
        });

        if (
            existingPost &&
            existingPost.title === attrs.title &&
            attrs.title !== post.title
        ) {
            throw new BadRequestException("Post name already exists");
        }

        attrs.slug = slugify(attrs.title);
        Object.entries(attrs).forEach(([key, value]) => {
            post[key] = value;
        });

        const updatedCategory = await post.save();
        return updatedCategory;
    }

    async deleteOne(id: string): Promise<void> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException("Invalid post ID.");
        }

        const post = await this.postModel.findById(id);
        if (!post) throw new BadRequestException("Post not found");

        await post.remove();
    }

    async deleteMany(): Promise<DeleteResult> {
        return await this.postModel.deleteMany({});
    }
}
