import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomerDbService } from 'src/databaseModules/customer/customer-db.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';

@Injectable()
export class CreateCustomerUseCase {
  constructor(private readonly customerDb: CustomerDbService) {}

  async execute(dto: CreateCustomerDto) {
    try {
      return await this.customerDb.create(dto);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to create customer');
    }
  }
}
