import { Module } from '@nestjs/common';
import { CustomerDbService } from './customer-db.service';

@Module({
  providers: [CustomerDbService],
  exports: [CustomerDbService],
})
export class CustomerDbModule {}
