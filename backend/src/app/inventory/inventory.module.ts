import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryDbModule } from '../../databaseModules/inventory/inventory-db.module';
import { FindAllInventoryUseCase } from './use-cases/find-all-inventory.use-case';
import { FindOneInventoryUseCase } from './use-cases/find-one-inventory.use-case';
import { CreateInventoryUseCase } from './use-cases/create-inventory.use-case';
import { UpdateInventoryUseCase } from './use-cases/update-inventory.use-case';
import { RemoveInventoryUseCase } from './use-cases/remove-inventory.use-case';

@Module({
  imports: [InventoryDbModule],
  controllers: [InventoryController],
  providers: [
    FindAllInventoryUseCase,
    FindOneInventoryUseCase,
    CreateInventoryUseCase,
    UpdateInventoryUseCase,
    RemoveInventoryUseCase,
  ],
})
export class InventoryModule {}
