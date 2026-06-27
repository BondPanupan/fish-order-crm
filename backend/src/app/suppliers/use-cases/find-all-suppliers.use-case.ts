import { BadRequestException, Injectable } from '@nestjs/common';
import { SupplierDbService } from 'src/databaseModules/supplier/supplier-db.service';

@Injectable()
export class FindAllSuppliersUseCase {
  constructor(private readonly supplierDb: SupplierDbService) {}

  async execute() {
    try {
      return await this.supplierDb.findAll();
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to fetch suppliers');
    }
  }
}
