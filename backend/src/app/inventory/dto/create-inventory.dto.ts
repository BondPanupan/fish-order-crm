import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateInventoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Supplier is required' })
  supplierId: string;

  @IsString()
  @IsNotEmpty({ message: 'Warehouse is required' })
  warehouseId: string;

  @IsString()
  @IsNotEmpty({ message: 'Item is required' })
  itemId: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Remaining quantity must be 0 or greater' })
  remainingQuantity?: number;
}
