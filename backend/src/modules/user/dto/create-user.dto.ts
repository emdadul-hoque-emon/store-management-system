import { IsEnum, IsString, IsUUID } from 'class-validator';
import { userRoleEnum } from '../user.schema';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;

  @IsUUID()
  storeId: string;

  @IsString()
  password: string;

  @IsEnum(['admin', 'employee'], {
    message: 'Role must be admin or employee',
  })
  role: 'admin' | 'employee';
}
