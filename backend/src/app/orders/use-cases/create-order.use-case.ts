import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderDbService } from 'src/databaseModules/order/order-db.service';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class CreateOrderUseCase {
  constructor(private readonly orderDb: OrderDbService) {}

  async execute(dto: CreateOrderDto) {
    try {
      return await this.orderDb.create(dto);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to create order');
    }
  }
}
