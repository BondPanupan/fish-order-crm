import { BadRequestException, Injectable } from '@nestjs/common';
import { WarehouseDbService } from 'src/databaseModules/warehouse/warehouse-db.service';
import { CreateWarehouseDto } from '../dto/create-warehouse.dto';

@Injectable()
export class CreateWarehouseUseCase {
  constructor(private readonly warehouseDb: WarehouseDbService) {}

  async execute(dto: CreateWarehouseDto) {
    try {
      return await this.warehouseDb.create(dto);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to create warehouse');
    }
  }
}
