import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsPhoneNumber,
  IsArray,
} from "class-validator";

export class AdminProfileDto {
  @IsString()
  @MinLength(4, { message: "Full name is too short." })
  @MaxLength(20, { message: "Full name is too long." })
  @IsOptional()
  fullName?: string;

  @IsEmail({}, { message: "Email address is not valid." })
  @IsOptional()
  email?: string;

  @IsPhoneNumber("VN", { message: "Phone number is not valid." })
  @IsOptional()
  phone?: string;

  @IsArray()
  @IsOptional()
  roles?: string[];

  @IsOptional()
  address?: string;

  @IsOptional()
  shippingAddress?: string;
}
