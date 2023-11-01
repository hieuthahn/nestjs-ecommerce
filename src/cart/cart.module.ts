import { Module } from "@nestjs/common";
import { CartService } from "./services/cart.service";
import { CartController } from "./controller/cart.controller";
import { ProductsModule } from "src/products/products.module";

@Module({
    imports: [ProductsModule],
    providers: [CartService],
    controllers: [CartController],
})
export class CartModule {}
