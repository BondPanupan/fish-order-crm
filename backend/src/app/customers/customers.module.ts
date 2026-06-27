import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomerDbModule } from '../../databaseModules/customer/customer-db.module';
import { FindAllCustomersUseCase } from './use-cases/find-all-customers.use-case';
import { FindOneCustomerUseCase } from './use-cases/find-one-customer.use-case';
import { CreateCustomerUseCase } from './use-cases/create-customer.use-case';
import { UpdateCustomerUseCase } from './use-cases/update-customer.use-case';
import { RemoveCustomerUseCase } from './use-cases/remove-customer.use-case';

@Module({
  imports: [CustomerDbModule],
  controllers: [CustomersController],
  providers: [
    FindAllCustomersUseCase,
    FindOneCustomerUseCase,
    CreateCustomerUseCase,
    UpdateCustomerUseCase,
    RemoveCustomerUseCase,
  ],
})
export class CustomersModule {}
