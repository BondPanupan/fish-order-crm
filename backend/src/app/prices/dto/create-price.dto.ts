import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class CreatePriceDto {
  @IsString()
  @IsNotEmpty({ message: 'Item is required' })
  itemId: string;

  @IsString()
  @IsNotEmpty({ message: 'Supplier is required' })
  supplierId: string;

  @IsOptional()
  @IsString()
  orderTypeId?: string | null;

  @IsNumber()
  @Min(0.01, { message: 'Unit price must be greater than 0' })
  unitPrice: number;
}
