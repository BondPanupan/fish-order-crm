import { BadRequestException, Injectable } from '@nestjs/common';
import { InventoryDbService } from 'src/databaseModules/inventory/inventory-db.service';
import { CreateInventoryDto } from '../dto/create-inventory.dto';

@Injectable()
export class CreateInventoryUseCase {
  constructor(private readonly inventoryDb: InventoryDbService) {}

  async execute(dto: CreateInventoryDto) {
    try {
      return await this.inventoryDb.create(dto);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to create inventory');
    }
  }
}
