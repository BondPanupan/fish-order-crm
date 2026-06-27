import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomerDbService } from 'src/databaseModules/customer/customer-db.service';

@Injectable()
export class FindAllCustomersUseCase {
  constructor(private readonly customerDb: CustomerDbService) {}

  async execute() {
    try {
      return await this.customerDb.findAll();
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to fetch customers');
    }
  }
}
