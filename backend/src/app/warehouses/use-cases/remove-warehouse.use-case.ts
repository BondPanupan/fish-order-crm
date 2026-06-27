import { BadRequestException, Injectable } from '@nestjs/common';
import { WarehouseDbService } from 'src/databaseModules/warehouse/warehouse-db.service';

@Injectable()
export class RemoveWarehouseUseCase {
  constructor(private readonly warehouseDb: WarehouseDbService) {}

  async execute(id: string) {
    try {
      return await this.warehouseDb.remove(id);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to remove warehouse');
    }
  }
}
