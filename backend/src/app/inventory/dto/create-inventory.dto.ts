import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateInventoryDto {
  @IsString()
  supplierId: string;

  @IsString()
  warehouseId: string;

  @IsString()
  itemId: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  remainingQuantity?: number;
}
