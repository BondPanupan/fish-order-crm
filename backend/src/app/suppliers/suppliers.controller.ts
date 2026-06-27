import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { FindAllSuppliersUseCase } from './use-cases/find-all-suppliers.use-case';
import { FindOneSupplierUseCase } from './use-cases/find-one-supplier.use-case';
import { CreateSupplierUseCase } from './use-cases/create-supplier.use-case';
import { UpdateSupplierUseCase } from './use-cases/update-supplier.use-case';
import { RemoveSupplierUseCase } from './use-cases/remove-supplier.use-case';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Controller('suppliers')
export class SuppliersController {
  constructor(
    private readonly findAllSuppliers: FindAllSuppliersUseCase,
    private readonly findOneSupplier: FindOneSupplierUseCase,
    private readonly createSupplier: CreateSupplierUseCase,
    private readonly updateSupplier: UpdateSupplierUseCase,
    private readonly removeSupplier: RemoveSupplierUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateSupplierDto) {
    return this.createSupplier.execute(dto);
  }

  @Get()
  findAll() {
    return this.findAllSuppliers.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findOneSupplier.execute(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSupplierDto) {
    return this.updateSupplier.execute(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeSupplier.execute(id);
  }
}
