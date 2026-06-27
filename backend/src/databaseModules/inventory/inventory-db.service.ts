import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInventoryDto } from '../../app/inventory/dto/create-inventory.dto';
import { UpdateInventoryDto } from '../../app/inventory/dto/update-inventory.dto';

@Injectable()
export class InventoryDbService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateInventoryDto) {
    return this.prisma.inventory.create({
      data: {
        supplierId: dto.supplierId,
        warehouseId: dto.warehouseId,
        itemId: dto.itemId,
        remainingQuantity: dto.remainingQuantity ?? 0,
      },
      include: {
        item: { select: { id: true, code: true, name: true, unit: true } },
        supplier: { select: { id: true, code: true, name: true } },
        warehouse: { select: { id: true, code: true, name: true } },
      },
    });
  }

  findAll() {
    return this.prisma.inventory.findMany({
      where: { isDeleted: false },
      orderBy: [{ item: { code: 'asc' } }, { remainingQuantity: 'desc' }],
      include: {
        item: { select: { id: true, code: true, name: true, unit: true } },
        supplier: { select: { id: true, code: true, name: true } },
        warehouse: { select: { id: true, code: true, name: true } },
      },
    });
  }

  async findOne(id: string) {
    const inv = await this.prisma.inventory.findFirst({
      where: { id, isDeleted: false },
      include: {
        item: { select: { id: true, code: true, name: true, unit: true } },
        supplier: { select: { id: true, code: true, name: true } },
        warehouse: { select: { id: true, code: true, name: true } },
      },
    });
    if (!inv) throw new NotFoundException(`Inventory ${id} not found`);
    return inv;
  }

  async update(id: string, dto: UpdateInventoryDto) {
    await this.findOne(id);
    return this.prisma.inventory.update({
      where: { id },
      data: {
        ...(dto.remainingQuantity !== undefined && { remainingQuantity: dto.remainingQuantity }),
        ...(dto.supplierId !== undefined && { supplierId: dto.supplierId }),
        ...(dto.warehouseId !== undefined && { warehouseId: dto.warehouseId }),
        ...(dto.itemId !== undefined && { itemId: dto.itemId }),
      },
      include: {
        item: { select: { id: true, code: true, name: true, unit: true } },
        supplier: { select: { id: true, code: true, name: true } },
        warehouse: { select: { id: true, code: true, name: true } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.inventory.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
