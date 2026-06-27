import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrderDbModule } from '../../databaseModules/order/order-db.module';
import { FindAllOrdersUseCase } from './use-cases/find-all-orders.use-case';
import { FindOneOrderUseCase } from './use-cases/find-one-order.use-case';
import { CreateOrderUseCase } from './use-cases/create-order.use-case';
import { UpdateOrderUseCase } from './use-cases/update-order.use-case';
import { RemoveOrderUseCase } from './use-cases/remove-order.use-case';

@Module({
  imports: [OrderDbModule],
  controllers: [OrdersController],
  providers: [
    FindAllOrdersUseCase,
    FindOneOrderUseCase,
    CreateOrderUseCase,
    UpdateOrderUseCase,
    RemoveOrderUseCase,
  ],
})
export class OrdersModule {}
