import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { FindAllInventoryUseCase } from './use-cases/find-all-inventory.use-case';
import { FindOneInventoryUseCase } from './use-cases/find-one-inventory.use-case';
import { CreateInventoryUseCase } from './use-cases/create-inventory.use-case';
import { UpdateInventoryUseCase } from './use-cases/update-inventory.use-case';
import { RemoveInventoryUseCase } from './use-cases/remove-inventory.use-case';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly findAllInventory: FindAllInventoryUseCase,
    private readonly findOneInventory: FindOneInventoryUseCase,
    private readonly createInventory: CreateInventoryUseCase,
    private readonly updateInventory: UpdateInventoryUseCase,
    private readonly removeInventory: RemoveInventoryUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateInventoryDto) {
    return this.createInventory.execute(dto);
  }

  @Get()
  findAll() {
    return this.findAllInventory.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findOneInventory.execute(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInventoryDto) {
    return this.updateInventory.execute(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeInventory.execute(id);
  }
}
