import { Module } from '@nestjs/common';
import { PricesController } from './prices.controller';
import { PriceDbModule } from '../../databaseModules/price/price-db.module';
import { FindAllPricesUseCase } from './use-cases/find-all-prices.use-case';
import { FindOnePriceUseCase } from './use-cases/find-one-price.use-case';
import { CreatePriceUseCase } from './use-cases/create-price.use-case';
import { UpdatePriceUseCase } from './use-cases/update-price.use-case';
import { RemovePriceUseCase } from './use-cases/remove-price.use-case';

@Module({
  imports: [PriceDbModule],
  controllers: [PricesController],
  providers: [
    FindAllPricesUseCase,
    FindOnePriceUseCase,
    CreatePriceUseCase,
    UpdatePriceUseCase,
    RemovePriceUseCase,
  ],
})
export class PricesModule {}
