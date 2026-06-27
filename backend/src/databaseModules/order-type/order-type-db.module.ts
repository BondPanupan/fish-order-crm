import { Module } from '@nestjs/common';
import { OrderTypeDbService } from './order-type-db.service';

@Module({
  providers: [OrderTypeDbService],
  exports: [OrderTypeDbService],
})
export class OrderTypeDbModule {}
