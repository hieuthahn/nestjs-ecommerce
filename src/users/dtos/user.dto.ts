import { Expose, Transform } from "class-transformer";
import { IsOptional } from "class-validator";
import { ObjectId } from "mongoose";

export class UserDto {
    @Expose()
    email: string;

    @Expose()
    @Transform(({ key, obj }) => obj[key])
    _id: ObjectId;

    @Expose()
    fullName: string;

    @Expose()
    roles: string[];

    @Expose()
    address: string;

    @Expose()
    shippingAddress: string;

    @Expose()
    phone: string;

    @Expose()
    accessToken?: string;
}
