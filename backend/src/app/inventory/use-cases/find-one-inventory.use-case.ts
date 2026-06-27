import { BadRequestException, Injectable } from '@nestjs/common';
import { InventoryDbService } from 'src/databaseModules/inventory/inventory-db.service';

@Injectable()
export class FindOneInventoryUseCase {
  constructor(private readonly inventoryDb: InventoryDbService) {}

  async execute(id: string) {
    try {
      return await this.inventoryDb.findOne(id);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to fetch inventory');
    }
  }
}
