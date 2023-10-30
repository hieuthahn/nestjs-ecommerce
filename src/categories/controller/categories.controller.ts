import { AdminGuard } from "src/guards/admin.guard";
import { CategoriesService } from "./../services/categories.service";
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
import { CategoryDto } from "../dtos/category.dto";

@Controller("categories")
export class CategoriesController {
    constructor(private categoriesServices: CategoriesService) {}

    @Get()
    getCategories(
        @Query("page") page: Number,
        @Query("pageSize") pageSize: Number
    ) {
        return this.categoriesServices.findAll(+page, +pageSize);
    }

    @Get(":id")
    getCategory(@Param("id") id: string) {
        return this.categoriesServices.findById(id);
    }

    @UseGuards(AdminGuard)
    @Post()
    createCategory(@Body() category: CategoryDto) {
        return this.categoriesServices.create(category);
    }

    @UseGuards(AdminGuard)
    @Put(":id")
    updateCategory(@Param("id") id: string, @Body() category: CategoryDto) {
        return this.categoriesServices.update(id, category);
    }

    @UseGuards(AdminGuard)
    @Delete(":id")
    deleteCategory(@Param("id") id: string) {
        return this.categoriesServices.deleteOne(id);
    }

    @UseGuards(AdminGuard)
    @Delete()
    deleteAllCategory() {
        return this.categoriesServices.deleteMany();
    }
}
