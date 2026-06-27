import { BadRequestException, Injectable } from '@nestjs/common';
import { InventoryDbService } from 'src/databaseModules/inventory/inventory-db.service';
import { UpdateInventoryDto } from '../dto/update-inventory.dto';

@Injectable()
export class UpdateInventoryUseCase {
  constructor(private readonly inventoryDb: InventoryDbService) {}

  async execute(id: string, dto: UpdateInventoryDto) {
    try {
      return await this.inventoryDb.update(id, dto);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to update inventory');
    }
  }
}
