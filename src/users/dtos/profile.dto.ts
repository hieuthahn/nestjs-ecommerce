import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsPhoneNumber,
} from "class-validator";

export class ProfileDto {
  @IsString()
  @MinLength(4, { message: "Full name is too short." })
  @MaxLength(20, { message: "Full name is too long." })
  @IsOptional()
  fullName?: string;

  @IsEmail({}, { message: "Email address is not valid." })
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(5, { message: "Password is too short." })
  @MaxLength(20, { message: "Password is too long." })
  @IsOptional()
  password?: string;

  @IsPhoneNumber("VN", { message: "Phone number is not valid." })
  @IsOptional()
  phone?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  shippingAddress?: string;
}
