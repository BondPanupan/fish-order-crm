import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateInventoryDto {
  @IsOptional()
  @IsString()
  supplierId?: string;

  @IsOptional()
  @IsString()
  warehouseId?: string;

  @IsOptional()
  @IsString()
  itemId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  remainingQuantity?: number;
}
