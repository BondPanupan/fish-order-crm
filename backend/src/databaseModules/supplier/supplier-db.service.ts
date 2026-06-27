import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSupplierDto } from '../../app/suppliers/dto/create-supplier.dto';
import { UpdateSupplierDto } from '../../app/suppliers/dto/update-supplier.dto';

@Injectable()
export class SupplierDbService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateSupplierDto) {
    return this.prisma.supplier.create({
      data: { code: dto.code, name: dto.name, isWildcard: dto.isWildcard ?? false },
    });
  }

  findAll() {
    return this.prisma.supplier.findMany({
      where: { isDeleted: false },
      orderBy: { code: 'asc' },
      select: { id: true, code: true, name: true, isWildcard: true, createdAt: true, updatedAt: true, createdBy: true, updatedBy: true },
    });
  }

  async findOne(id: string) {
    const supplier = await this.prisma.supplier.findFirst({ where: { id, isDeleted: false } });
    if (!supplier) throw new NotFoundException(`Supplier ${id} not found`);
    return supplier;
  }

  async update(id: string, dto: UpdateSupplierDto) {
    await this.findOne(id);
    return this.prisma.supplier.update({
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
    return this.prisma.supplier.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
