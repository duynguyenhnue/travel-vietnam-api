import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDateString,
  Length,
} from "class-validator";

export class Address {
  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  ward: string;
}

export class Phone {
  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  number: string;
}

export class CreateUserRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 32)
  password: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth: string | null;

  @IsNotEmpty()
  address: Address;

  @IsNotEmpty()
  phone: Phone;
}

export class UpdateUserRequest {
  @IsString()
  @IsOptional()
  avatar?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  @Length(8, 32)
  password?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string | null;

  @IsOptional()
  address?: Address;

  @IsOptional()
  phone?: Phone;

  @IsString()
  @IsOptional()
  status?: string;
}

export class SearchUserRequest {
  @IsString()
  @IsNotEmpty()
  page: number;

  @IsString()
  @IsNotEmpty()
  limit: number;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  email?: string;
}
