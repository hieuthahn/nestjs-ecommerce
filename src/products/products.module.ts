import { Module } from "@nestjs/common";
import { ProductsService } from "./services/products.service";
import { ProductsController } from "./controller/products.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "./schemas/product.schema";
import { CategoriesService } from "src/categories/services/categories.service";
import { CategoriesModule } from "src/categories/categories.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Product.name,
                schema: ProductSchema,
            },
        ]),
        CategoriesModule,
    ],
    providers: [ProductsService],
    controllers: [ProductsController],
    exports: [ProductsService],
})
export class ProductsModule {}
