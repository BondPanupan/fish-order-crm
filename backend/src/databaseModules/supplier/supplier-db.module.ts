import { Module } from '@nestjs/common';
import { SupplierDbService } from './supplier-db.service';

@Module({
  providers: [SupplierDbService],
  exports: [SupplierDbService],
})
export class SupplierDbModule {}
