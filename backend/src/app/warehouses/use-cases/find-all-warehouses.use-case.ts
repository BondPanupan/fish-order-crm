import { BadRequestException, Injectable } from '@nestjs/common';
import { WarehouseDbService } from '../../../databaseModules/warehouse/warehouse-db.service';

@Injectable()
export class FindAllWarehousesUseCase {
  constructor(private readonly warehouseDb: WarehouseDbService) {}

  async execute() {
    try {
      return await this.warehouseDb.findAll();
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to fetch warehouses');
    }
  }
}
