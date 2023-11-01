import { IsString } from "class-validator";

export class SaveShippingDetailsDto {
    @IsString()
    address: string;

    @IsString()
    city: string;

    @IsString()
    note: string;
}
