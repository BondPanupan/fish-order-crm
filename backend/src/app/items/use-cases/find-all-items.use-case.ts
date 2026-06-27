import { BadRequestException, Injectable } from '@nestjs/common';
import { ItemDbService } from 'src/databaseModules/item/item-db.service';

@Injectable()
export class FindAllItemsUseCase {
  constructor(private readonly itemDb: ItemDbService) {}

  async execute() {
    try {
      return await this.itemDb.findAll();
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to fetch items');
    }
  }
}
