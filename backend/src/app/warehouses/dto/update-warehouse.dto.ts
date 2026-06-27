import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateWarehouseDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isWildcard?: boolean;
}
