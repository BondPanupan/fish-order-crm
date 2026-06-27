import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { FindAllCustomersUseCase } from './use-cases/find-all-customers.use-case';
import { FindOneCustomerUseCase } from './use-cases/find-one-customer.use-case';
import { CreateCustomerUseCase } from './use-cases/create-customer.use-case';
import { UpdateCustomerUseCase } from './use-cases/update-customer.use-case';
import { RemoveCustomerUseCase } from './use-cases/remove-customer.use-case';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly findAllCustomers: FindAllCustomersUseCase,
    private readonly findOneCustomer: FindOneCustomerUseCase,
    private readonly createCustomer: CreateCustomerUseCase,
    private readonly updateCustomer: UpdateCustomerUseCase,
    private readonly removeCustomer: RemoveCustomerUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateCustomerDto) {
    return this.createCustomer.execute(dto);
  }

  @Get()
  findAll() {
    return this.findAllCustomers.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findOneCustomer.execute(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.updateCustomer.execute(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeCustomer.execute(id);
  }
}
