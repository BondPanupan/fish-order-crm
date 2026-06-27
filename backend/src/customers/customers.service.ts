import { Injectable } from '@nestjs/common';
import { CustomerDbService } from '../databaseModules/customer/customer-db.service';
import { CreateCustomerDto } from '../databaseModules/customer/dto/create-customer.interface';
import { UpdateCustomerDto } from '../databaseModules/customer/dto/update-customer.interface';

@Injectable()
export class CustomersService {
  constructor(private readonly customerDb: CustomerDbService) {}

  create(dto: CreateCustomerDto) {
    return this.customerDb.create(dto);
  }

  findAll() {
    return this.customerDb.findAll();
  }

  findOne(id: string) {
    return this.customerDb.findOne(id);
  }

  update(id: string, dto: UpdateCustomerDto) {
    return this.customerDb.update(id, dto);
  }

  remove(id: string) {
    return this.customerDb.remove(id);
  }
}
