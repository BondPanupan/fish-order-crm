import { BadRequestException, Injectable } from '@nestjs/common';
import { ItemDbService } from 'src/databaseModules/item/item-db.service';

@Injectable()
export class FindOneItemUseCase {
  constructor(private readonly itemDb: ItemDbService) {}

  async execute(id: string) {
    try {
      return await this.itemDb.findOne(id);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to fetch item');
    }
  }
}
