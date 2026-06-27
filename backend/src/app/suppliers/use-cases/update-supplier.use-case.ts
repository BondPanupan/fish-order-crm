import { BadRequestException, Injectable } from '@nestjs/common';
import { SupplierDbService } from 'src/databaseModules/supplier/supplier-db.service';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';

@Injectable()
export class UpdateSupplierUseCase {
  constructor(private readonly supplierDb: SupplierDbService) {}

  async execute(id: string, dto: UpdateSupplierDto) {
    try {
      return await this.supplierDb.update(id, dto);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to update supplier');
    }
  }
}
