import { BadRequestException, Injectable } from '@nestjs/common';
import { PriceDbService } from 'src/databaseModules/price/price-db.service';
import { UpdatePriceDto } from '../dto/update-price.dto';

@Injectable()
export class UpdatePriceUseCase {
  constructor(private readonly priceDb: PriceDbService) {}

  async execute(id: string, dto: UpdatePriceDto) {
    try {
      return await this.priceDb.update(id, dto);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to update price');
    }
  }
}
