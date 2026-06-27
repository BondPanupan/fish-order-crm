import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CustomerDbModule } from '../databaseModules/customer/customer-db.module';

@Module({
  imports: [CustomerDbModule],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
