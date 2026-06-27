import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateItemDto } from '../../app/items/dto/create-item.dto';
import { UpdateItemDto } from '../../app/items/dto/update-item.dto';

@Injectable()
export class ItemDbService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateItemDto) {
    return this.prisma.item.create({
      data: { code: dto.code, name: dto.name, unit: dto.unit ?? 'kg' },
    });
  }

  findAll() {
    return this.prisma.item.findMany({
      where: { isDeleted: false },
      orderBy: { code: 'asc' },
      select: { id: true, code: true, name: true, unit: true, createdAt: true, updatedAt: true, createdBy: true, updatedBy: true },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.item.findFirst({ where: { id, isDeleted: false } });
    if (!item) throw new NotFoundException(`Item ${id} not found`);
    return item;
  }

  async update(id: string, dto: UpdateItemDto) {
    await this.findOne(id);
    return this.prisma.item.update({
      where: { id },
      data: {
        ...(dto.code !== undefined && { code: dto.code }),
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.unit !== undefined && { unit: dto.unit }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.item.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
