import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomerDbService } from 'src/databaseModules/customer/customer-db.service';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

@Injectable()
export class UpdateCustomerUseCase {
  constructor(private readonly customerDb: CustomerDbService) {}

  async execute(id: string, dto: UpdateCustomerDto) {
    try {
      return await this.customerDb.update(id, dto);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to update customer');
    }
  }
}
