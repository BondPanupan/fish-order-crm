import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderDbService } from 'src/databaseModules/order/order-db.service';

@Injectable()
export class FindOneOrderUseCase {
  constructor(private readonly orderDb: OrderDbService) {}

  async execute(id: string) {
    try {
      return await this.orderDb.findOne(id);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to fetch order');
    }
  }
}
