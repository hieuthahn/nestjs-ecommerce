import { CartItem, ShippingDetails } from "src/interfaces";

export interface CartInterface {
    cartItems: CartItem[];
    shippingDetails: ShippingDetails;
    paymentMethod: string;
}

export const defaultCart = {
    cartItems: [],
    shippingDetails: {
        address: "",
        city: "",
        note: "",
    },
    paymentMethod: "banking",
};

export class Cart {
    constructor(public cart: CartInterface = defaultCart) {}
}
