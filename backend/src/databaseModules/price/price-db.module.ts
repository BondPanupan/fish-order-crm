import { Module } from '@nestjs/common';
import { PriceDbService } from './price-db.service';

@Module({
  providers: [PriceDbService],
  exports: [PriceDbService],
})
export class PriceDbModule {}
