import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomerDbService } from 'src/databaseModules/customer/customer-db.service';

@Injectable()
export class RemoveCustomerUseCase {
  constructor(private readonly customerDb: CustomerDbService) {}

  async execute(id: string) {
    try {
      return await this.customerDb.remove(id);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to remove customer');
    }
  }
}
