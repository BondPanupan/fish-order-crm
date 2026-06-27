import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { FindAllOrdersUseCase } from './use-cases/find-all-orders.use-case';
import { FindOneOrderUseCase } from './use-cases/find-one-order.use-case';
import { CreateOrderUseCase } from './use-cases/create-order.use-case';
import { UpdateOrderUseCase } from './use-cases/update-order.use-case';
import { RemoveOrderUseCase } from './use-cases/remove-order.use-case';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly findAllOrders: FindAllOrdersUseCase,
    private readonly findOneOrder: FindOneOrderUseCase,
    private readonly createOrder: CreateOrderUseCase,
    private readonly updateOrder: UpdateOrderUseCase,
    private readonly removeOrder: RemoveOrderUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.createOrder.execute(dto);
  }

  @Get()
  findAll() {
    return this.findAllOrders.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findOneOrder.execute(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.updateOrder.execute(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeOrder.execute(id);
  }
}
