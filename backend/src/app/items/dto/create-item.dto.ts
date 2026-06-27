import { IsString, IsOptional } from 'class-validator';

export class CreateItemDto {
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  unit?: string;
}
