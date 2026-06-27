import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderDbService } from 'src/databaseModules/order/order-db.service';

@Injectable()
export class FindAllOrdersUseCase {
  constructor(private readonly orderDb: OrderDbService) {}

  async execute() {
    try {
      return await this.orderDb.findAll();
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to fetch orders');
    }
  }
}
