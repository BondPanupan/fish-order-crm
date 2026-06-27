import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CustomersModule } from './app/customers/customers.module';
import { ItemsModule } from './app/items/items.module';
import { SuppliersModule } from './app/suppliers/suppliers.module';
import { WarehousesModule } from './app/warehouses/warehouses.module';
import { InventoryModule } from './app/inventory/inventory.module';
import { PricesModule } from './app/prices/prices.module';
import { OrderTypesModule } from './app/order-types/order-types.module';
import { OrdersModule } from './app/orders/orders.module';

@Module({
  imports: [PrismaModule, CustomersModule, ItemsModule, SuppliersModule, WarehousesModule, InventoryModule, PricesModule, OrderTypesModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
