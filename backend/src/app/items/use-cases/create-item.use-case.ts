import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateItemDto } from '../dto/create-item.dto';
import { ItemDbService } from '../../../databaseModules/item/item-db.service';

@Injectable()
export class CreateItemUseCase {
  constructor(private readonly itemDb: ItemDbService) {}

  async execute(dto: CreateItemDto) {
    try {
      return await this.itemDb.create(dto);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to create item');
    }
  }
}
