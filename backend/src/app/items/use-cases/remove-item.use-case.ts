import { BadRequestException, Injectable } from '@nestjs/common';
import { ItemDbService } from 'src/databaseModules/item/item-db.service';

@Injectable()
export class RemoveItemUseCase {
  constructor(private readonly itemDb: ItemDbService) {}

  async execute(id: string) {
    try {
      return await this.itemDb.remove(id);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to remove item');
    }
  }
}
