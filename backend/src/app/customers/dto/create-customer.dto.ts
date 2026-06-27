import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  creditLimit?: number;
}
