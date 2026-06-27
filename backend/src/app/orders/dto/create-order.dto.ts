import { Type } from 'class-transformer';
import { IsString, IsOptional, IsArray, ValidateNested, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateSubOrderDto {
  @IsString()
  itemId: string;

  @IsString()
  warehouseId: string;

  @IsString()
  supplierId: string;

  @IsNumber()
  @Min(0)
  requestQuantity: number;

  @IsString()
  orderTypeId: string;

  @IsDateString()
  createDate: string;
}

export class CreateOrderDto {
  @IsString()
  code: string;

  @IsString()
  customerId: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubOrderDto)
  subOrders: CreateSubOrderDto[];
}
