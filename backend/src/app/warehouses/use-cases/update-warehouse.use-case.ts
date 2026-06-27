import { BadRequestException, Injectable } from '@nestjs/common';
import { WarehouseDbService } from 'src/databaseModules/warehouse/warehouse-db.service';
import { UpdateWarehouseDto } from '../dto/update-warehouse.dto';

@Injectable()
export class UpdateWarehouseUseCase {
  constructor(private readonly warehouseDb: WarehouseDbService) {}

  async execute(id: string, dto: UpdateWarehouseDto) {
    try {
      return await this.warehouseDb.update(id, dto);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to update warehouse');
    }
  }
}
