import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemDbModule } from '../../databaseModules/item/item-db.module';
import { FindAllItemsUseCase } from './use-cases/find-all-items.use-case';
import { FindOneItemUseCase } from './use-cases/find-one-item.use-case';
import { CreateItemUseCase } from './use-cases/create-item.use-case';
import { UpdateItemUseCase } from './use-cases/update-item.use-case';
import { RemoveItemUseCase } from './use-cases/remove-item.use-case';

@Module({
  imports: [ItemDbModule],
  controllers: [ItemsController],
  providers: [
    FindAllItemsUseCase,
    FindOneItemUseCase,
    CreateItemUseCase,
    UpdateItemUseCase,
    RemoveItemUseCase,
  ],
})
export class ItemsModule {}
