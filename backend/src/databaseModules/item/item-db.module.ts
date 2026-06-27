import { Module } from '@nestjs/common';
import { ItemDbService } from './item-db.service';

@Module({
  providers: [ItemDbService],
  exports: [ItemDbService],
})
export class ItemDbModule {}
