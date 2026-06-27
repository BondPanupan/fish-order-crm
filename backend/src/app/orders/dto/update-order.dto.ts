import { IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  remark?: string;
}
