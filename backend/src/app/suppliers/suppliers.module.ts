import { Module } from '@nestjs/common';
import { SuppliersController } from './suppliers.controller';
import { SupplierDbModule } from '../../databaseModules/supplier/supplier-db.module';
import { FindAllSuppliersUseCase } from './use-cases/find-all-suppliers.use-case';
import { FindOneSupplierUseCase } from './use-cases/find-one-supplier.use-case';
import { CreateSupplierUseCase } from './use-cases/create-supplier.use-case';
import { UpdateSupplierUseCase } from './use-cases/update-supplier.use-case';
import { RemoveSupplierUseCase } from './use-cases/remove-supplier.use-case';

@Module({
  imports: [SupplierDbModule],
  controllers: [SuppliersController],
  providers: [
    FindAllSuppliersUseCase,
    FindOneSupplierUseCase,
    CreateSupplierUseCase,
    UpdateSupplierUseCase,
    RemoveSupplierUseCase,
  ],
})
export class SuppliersModule {}
