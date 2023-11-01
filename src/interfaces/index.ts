import { CategoryDocument } from "src/categories/schemas/category.schema";
import { PostDocument } from "src/posts/schemas/post.schema";
import {
    Image,
    Product,
    ProductDocument,
} from "src/products/schemas/product.schema";

export interface ShippingDetails {
    address: string;
    city: string;
    note: string;
}

export interface OrderItem {
    name: string;
    qty: number;
    image: Image[];
    price: number;
    productId: Product;
}

export interface PaymentResult {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
}

export interface CartItem {
    productId: string;
    name: string;
    images: Image[];
    price: number | string;
    countInStock: number;
    qty: number;
}

export interface PaginatedProducts {
    products: ProductDocument[];
    pages?: number;
    page?: number;
    pageSize?: number;
}

export interface PaginatedCategories {
    categories: CategoryDocument[];
    pages?: number;
    page?: number;
    pageSize?: number;
    total?: number;
}

export interface PaginatedPosts {
    posts: PostDocument[];
    pages?: number;
    page?: number;
    pageSize?: number;
    total?: number;
}
