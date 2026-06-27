import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWarehouseDto } from '../../app/warehouses/dto/create-warehouse.dto';
import { UpdateWarehouseDto } from '../../app/warehouses/dto/update-warehouse.dto';

@Injectable()
export class WarehouseDbService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateWarehouseDto) {
    return this.prisma.warehouse.create({
      data: { code: dto.code, name: dto.name, isWildcard: dto.isWildcard ?? false },
    });
  }

  findAll() {
    return this.prisma.warehouse.findMany({
      where: { isDeleted: false },
      orderBy: { code: 'asc' },
      select: { id: true, code: true, name: true, isWildcard: true, createdAt: true, updatedAt: true, createdBy: true, updatedBy: true },
    });
  }

  async findOne(id: string) {
    const warehouse = await this.prisma.warehouse.findFirst({ where: { id, isDeleted: false } });
    if (!warehouse) throw new NotFoundException(`Warehouse ${id} not found`);
    return warehouse;
  }

  async update(id: string, dto: UpdateWarehouseDto) {
    await this.findOne(id);
    return this.prisma.warehouse.update({
      where: { id },
      data: {
        ...(dto.code !== undefined && { code: dto.code }),
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.isWildcard !== undefined && { isWildcard: dto.isWildcard }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.warehouse.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
