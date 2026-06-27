import { BadRequestException, Injectable } from '@nestjs/common';
import { InventoryDbService } from 'src/databaseModules/inventory/inventory-db.service';

@Injectable()
export class FindAllInventoryUseCase {
  constructor(private readonly inventoryDb: InventoryDbService) {}

  async execute() {
    try {
      return await this.inventoryDb.findAll();
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to fetch inventory');
    }
  }
}
