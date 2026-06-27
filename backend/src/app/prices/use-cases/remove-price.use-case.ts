import { BadRequestException, Injectable } from '@nestjs/common';
import { PriceDbService } from '../../../databaseModules/price/price-db.service';

@Injectable()
export class RemovePriceUseCase {
  constructor(private readonly priceDb: PriceDbService) {}

  async execute(id: string) {
    try {
      return await this.priceDb.remove(id);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to delete price');
    }
  }
}
