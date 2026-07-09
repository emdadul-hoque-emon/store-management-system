import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryProductDto {
  @IsString()
  @IsOptional()
  search: string;

  @IsString()
  @IsOptional()
  orderBy: string = 'created_at';

  @IsString()
  @IsOptional()
  order?: string = 'desc';

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  limit: number = 10;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  page: number = 1;
}
