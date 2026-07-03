import { IsEnum, IsString } from 'class-validator';
import { userRoleEnum } from '../user.schema';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsEnum(['admin', 'employee'])
  role: 'admin' | 'employee';
}
