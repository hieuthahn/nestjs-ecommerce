import { Module } from "@nestjs/common";
import { MongooseModule, getConnectionToken } from "@nestjs/mongoose";
import { Post, PostSchema } from "./schemas/post.schema";
import { PostsService } from "./services/posts.service";
import { PostsController } from "./controller/posts.controller";
import * as AutoIncrementFactory from "mongoose-sequence";
import { Connection } from "mongoose";

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: Post.name,
                useFactory: async (connection: Connection) => {
                    const schema = PostSchema;

                    return schema;
                },
                inject: [getConnectionToken()],
            },
        ]),
    ],
    providers: [PostsService],
    controllers: [PostsController],
})
export class PostsModule {}
