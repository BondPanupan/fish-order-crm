import { Injectable } from '@nestjs/common';
import { PriceDbService } from 'src/databaseModules/price/price-db.service';

@Injectable()
export class FindAllPricesUseCase {
  constructor(private readonly priceDb: PriceDbService) {}

  execute() {
    return this.priceDb.findAll();
  }
}
