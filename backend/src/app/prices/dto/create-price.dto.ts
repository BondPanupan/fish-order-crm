import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreatePriceDto {
  @IsString()
  itemId: string;

  @IsString()
  supplierId: string;

  @IsOptional()
  @IsString()
  orderTypeId?: string | null;

  @IsNumber()
  @Min(0)
  unitPrice: number;
}
