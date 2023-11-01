import { Module } from "@nestjs/common";
import { MongooseModule, getConnectionToken } from "@nestjs/mongoose";
import { Category, CategorySchema } from "./schemas/category.schema";
import { CategoriesService } from "./services/categories.service";
import { CategoriesController } from "./controller/categories.controller";
import * as AutoIncrementFactory from "mongoose-sequence";
import { Connection } from "mongoose";

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: Category.name,
                useFactory: async (connection: Connection) => {
                    const schema = CategorySchema;
                    const AutoIncrement = AutoIncrementFactory(connection);
                    schema.plugin(AutoIncrement, { inc_field: "order" });
                    return schema;
                },
                inject: [getConnectionToken()],
            },
        ]),
    ],
    providers: [CategoriesService],
    controllers: [CategoriesController],
    exports: [CategoriesService],
})
export class CategoriesModule {}
