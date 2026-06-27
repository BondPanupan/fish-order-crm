import { BadRequestException, Injectable } from '@nestjs/common';
import { SupplierDbService } from 'src/databaseModules/supplier/supplier-db.service';

@Injectable()
export class FindOneSupplierUseCase {
  constructor(private readonly supplierDb: SupplierDbService) {}

  async execute(id: string) {
    try {
      return await this.supplierDb.findOne(id);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to fetch supplier');
    }
  }
}
