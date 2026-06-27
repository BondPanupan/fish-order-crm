import { BadRequestException, Injectable } from '@nestjs/common';
import { ItemDbService } from 'src/databaseModules/item/item-db.service';
import { UpdateItemDto } from '../dto/update-item.dto';

@Injectable()
export class UpdateItemUseCase {
  constructor(private readonly itemDb: ItemDbService) {}

  async execute(id: string, dto: UpdateItemDto) {
    try {
      return await this.itemDb.update(id, dto);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to update item');
    }
  }
}
