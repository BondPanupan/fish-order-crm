import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { FindAllWarehousesUseCase } from './use-cases/find-all-warehouses.use-case';
import { FindOneWarehouseUseCase } from './use-cases/find-one-warehouse.use-case';
import { CreateWarehouseUseCase } from './use-cases/create-warehouse.use-case';
import { UpdateWarehouseUseCase } from './use-cases/update-warehouse.use-case';
import { RemoveWarehouseUseCase } from './use-cases/remove-warehouse.use-case';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Controller('warehouses')
export class WarehousesController {
  constructor(
    private readonly findAllWarehouses: FindAllWarehousesUseCase,
    private readonly findOneWarehouse: FindOneWarehouseUseCase,
    private readonly createWarehouse: CreateWarehouseUseCase,
    private readonly updateWarehouse: UpdateWarehouseUseCase,
    private readonly removeWarehouse: RemoveWarehouseUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateWarehouseDto) {
    return this.createWarehouse.execute(dto);
  }

  @Get()
  findAll() {
    return this.findAllWarehouses.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findOneWarehouse.execute(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWarehouseDto) {
    return this.updateWarehouse.execute(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeWarehouse.execute(id);
  }
}
