import { BadRequestException, Injectable } from '@nestjs/common';
import { SupplierDbService } from 'src/databaseModules/supplier/supplier-db.service';
import { CreateSupplierDto } from '../dto/create-supplier.dto';

@Injectable()
export class CreateSupplierUseCase {
  constructor(private readonly supplierDb: SupplierDbService) {}

  async execute(dto: CreateSupplierDto) {
    try {
      return await this.supplierDb.create(dto);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to create supplier');
    }
  }
}
