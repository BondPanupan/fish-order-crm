import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { FindAllItemsUseCase } from './use-cases/find-all-items.use-case';
import { FindOneItemUseCase } from './use-cases/find-one-item.use-case';
import { CreateItemUseCase } from './use-cases/create-item.use-case';
import { UpdateItemUseCase } from './use-cases/update-item.use-case';
import { RemoveItemUseCase } from './use-cases/remove-item.use-case';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('items')
export class ItemsController {
  constructor(
    private readonly findAllItems: FindAllItemsUseCase,
    private readonly findOneItem: FindOneItemUseCase,
    private readonly createItem: CreateItemUseCase,
    private readonly updateItem: UpdateItemUseCase,
    private readonly removeItem: RemoveItemUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateItemDto) {
    return this.createItem.execute(dto);
  }

  @Get()
  findAll() {
    return this.findAllItems.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findOneItem.execute(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateItemDto) {
    return this.updateItem.execute(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeItem.execute(id);
  }
}
