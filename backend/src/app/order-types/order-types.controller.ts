import { Controller, Get } from '@nestjs/common';
import { OrderTypeDbService } from '../../databaseModules/order-type/order-type-db.service';

@Controller('order-types')
export class OrderTypesController {
  constructor(private readonly orderTypeDb: OrderTypeDbService) {}

  @Get()
  findAll() {
    return this.orderTypeDb.findAll();
  }
}
