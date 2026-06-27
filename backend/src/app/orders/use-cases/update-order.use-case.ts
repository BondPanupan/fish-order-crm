import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderDbService } from 'src/databaseModules/order/order-db.service';
import { UpdateOrderDto } from '../dto/update-order.dto';

@Injectable()
export class UpdateOrderUseCase {
  constructor(private readonly orderDb: OrderDbService) {}

  async execute(id: string, dto: UpdateOrderDto) {
    try {
      return await this.orderDb.update(id, dto);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to update order');
    }
  }
}
