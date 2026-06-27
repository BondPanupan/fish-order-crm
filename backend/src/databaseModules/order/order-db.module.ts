import { Module } from '@nestjs/common';
import { OrderDbService } from './order-db.service';

@Module({
  providers: [OrderDbService],
  exports: [OrderDbService],
})
export class OrderDbModule {}
