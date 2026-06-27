import { Module } from '@nestjs/common';
import { WarehousesController } from './warehouses.controller';
import { WarehouseDbModule } from '../../databaseModules/warehouse/warehouse-db.module';
import { FindAllWarehousesUseCase } from './use-cases/find-all-warehouses.use-case';
import { FindOneWarehouseUseCase } from './use-cases/find-one-warehouse.use-case';
import { CreateWarehouseUseCase } from './use-cases/create-warehouse.use-case';
import { UpdateWarehouseUseCase } from './use-cases/update-warehouse.use-case';
import { RemoveWarehouseUseCase } from './use-cases/remove-warehouse.use-case';

@Module({
  imports: [WarehouseDbModule],
  controllers: [WarehousesController],
  providers: [
    FindAllWarehousesUseCase,
    FindOneWarehouseUseCase,
    CreateWarehouseUseCase,
    UpdateWarehouseUseCase,
    RemoveWarehouseUseCase,
  ],
})
export class WarehousesModule {}
