import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomerDbService } from 'src/databaseModules/customer/customer-db.service';

@Injectable()
export class FindOneCustomerUseCase {
  constructor(private readonly customerDb: CustomerDbService) {}

  async execute(id: string) {
    try {
      return await this.customerDb.findOne(id);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to fetch customer');
    }
  }
}
