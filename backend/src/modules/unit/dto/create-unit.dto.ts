import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  name: string;

  @IsString()
  shortName: string;

  @IsString()
  baseUnit: string;

  @Type(() => Number)
  conversionFactor: number;
}
