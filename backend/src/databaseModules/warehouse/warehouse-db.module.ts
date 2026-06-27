import { Module } from '@nestjs/common';
import { WarehouseDbService } from './warehouse-db.service';

@Module({
  providers: [WarehouseDbService],
  exports: [WarehouseDbService],
})
export class WarehouseDbModule {}
