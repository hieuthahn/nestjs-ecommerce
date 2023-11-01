import { AdminGuard } from "src/guards/admin.guard";
import { PostsService } from "../services/posts.service";
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from "@nestjs/common";
import { PostDto } from "../dtos/post.dto";

@Controller("posts")
export class PostsController {
    constructor(private postsServices: PostsService) {}

    @Get()
    getCategories(
        @Query("page") page: Number,
        @Query("pageSize") pageSize: Number
    ) {
        return this.postsServices.findMany(+page, +pageSize);
    }

    @Get(":id")
    getCategory(@Param("id") id: string) {
        return this.postsServices.findById(id);
    }

    @UseGuards(AdminGuard)
    @Post()
    createCategory(@Body() category: PostDto) {
        return this.postsServices.create(category);
    }

    @UseGuards(AdminGuard)
    @Put(":id")
    updateCategory(@Param("id") id: string, @Body() category: PostDto) {
        return this.postsServices.update(id, category);
    }

    @UseGuards(AdminGuard)
    @Delete(":id")
    deleteCategory(@Param("id") id: string) {
        return this.postsServices.deleteOne(id);
    }

    @UseGuards(AdminGuard)
    @Delete()
    deleteAllCategory() {
        return this.postsServices.deleteMany();
    }
}
