import { BadRequestException, Injectable } from '@nestjs/common';
import { PriceDbService } from 'src/databaseModules/price/price-db.service';
import { CreatePriceDto } from '../dto/create-price.dto';

@Injectable()
export class CreatePriceUseCase {
  constructor(private readonly priceDb: PriceDbService) {}

  async execute(dto: CreatePriceDto) {
    try {
      return await this.priceDb.create(dto);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to create price');
    }
  }
}
