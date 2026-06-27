import { Injectable } from '@nestjs/common';
import { PriceDbService } from 'src/databaseModules/price/price-db.service';

@Injectable()
export class FindOnePriceUseCase {
  constructor(private readonly priceDb: PriceDbService) {}

  execute(id: string) {
    return this.priceDb.findOne(id);
  }
}
