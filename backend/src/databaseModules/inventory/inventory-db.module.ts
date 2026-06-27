import { Module } from '@nestjs/common';
import { InventoryDbService } from './inventory-db.service';

@Module({
  providers: [InventoryDbService],
  exports: [InventoryDbService],
})
export class InventoryDbModule {}
