import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateSupplierDto {
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
