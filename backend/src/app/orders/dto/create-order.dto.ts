import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsNumber, IsDateString, Min, ArrayMinSize } from 'class-validator';

export class CreateSubOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'Item is required' })
  itemId: string;

  @IsString()
  @IsNotEmpty({ message: 'Warehouse is required' })
  warehouseId: string;

  @IsString()
  @IsNotEmpty({ message: 'Supplier is required' })
  supplierId: string;

  @IsNumber()
  @Min(0.01, { message: 'Quantity must be greater than 0' })
  requestQuantity: number;

  @IsString()
  @IsNotEmpty({ message: 'Order type is required' })
  orderTypeId: string;

  @IsDateString({}, { message: 'Date must be a valid date' })
  createDate: string;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'Order code is required' })
  code: string;

  @IsString()
  @IsNotEmpty({ message: 'Customer is required' })
  customerId: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Order must have at least one line' })
  @ValidateNested({ each: true })
  @Type(() => CreateSubOrderDto)
  subOrders: CreateSubOrderDto[];
}
