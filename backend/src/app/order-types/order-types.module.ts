import { Module } from '@nestjs/common';
import { OrderTypesController } from './order-types.controller';
import { OrderTypeDbModule } from '../../databaseModules/order-type/order-type-db.module';

@Module({
  imports: [OrderTypeDbModule],
  controllers: [OrderTypesController],
})
export class OrderTypesModule {}
