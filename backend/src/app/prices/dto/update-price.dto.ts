import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class UpdatePriceDto {
  @IsOptional()
  @IsString()
  orderTypeId?: string | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number;
}
