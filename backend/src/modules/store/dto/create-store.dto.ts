import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

const Trim = () =>
  Transform(({ value }) => (typeof value === 'string' ? value.trim() : value));

export class CreateStoreDto {
  // Store
  @Trim()
  @IsString()
  @MinLength(1)
  store_name: string;

  @Trim()
  @IsEmail()
  store_email: string;

  @Trim()
  @IsString()
  @MinLength(1)
  store_phone: string;

  @Trim()
  @IsString()
  @MinLength(1)
  store_address: string;

  @IsBoolean()
  use_store_info: boolean;

  // Admin
  @ValidateIf((o) => !o.use_store_info)
  @Trim()
  @IsString()
  @MinLength(1)
  name?: string;

  @ValidateIf((o) => !o.use_store_info)
  @Trim()
  @IsEmail()
  email?: string;

  @ValidateIf((o) => !o.use_store_info)
  @Trim()
  @IsOptional()
  @IsString()
  phone?: string;

  @ValidateIf((o) => !o.use_store_info)
  @Trim()
  @IsString()
  @MinLength(6)
  password?: string = 'admin';
}
