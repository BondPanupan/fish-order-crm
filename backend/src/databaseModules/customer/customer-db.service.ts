import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from '../../app/customers/dto/create-customer.dto';
import { UpdateCustomerDto } from '../../app/customers/dto/update-customer.dto';

@Injectable()
export class CustomerDbService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: {
        code: dto.code,
        name: dto.name,
        creditLimit: dto.creditLimit ?? 0,
      },
    });
  }

  findAll() {
    return this.prisma.customer.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        code: true,
        name: true,
        creditLimit: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
        updatedBy: true,
        _count: { select: { orders: true } },
      },
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, isDeleted: false },
      include: { orders: { orderBy: { createdAt: 'desc' } } },
    });
    if (!customer) throw new NotFoundException(`Customer ${id} not found`);
    return customer;
  }

  async findByCode(code: string) {
    const customer = await this.prisma.customer.findFirst({ where: { code, isDeleted: false } });
    if (!customer) throw new NotFoundException(`Customer code ${code} not found`);
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    await this.findOne(id);
    return this.prisma.customer.update({
      where: { id },
      data: {
        ...(dto.code !== undefined && { code: dto.code }),
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.creditLimit !== undefined && { creditLimit: dto.creditLimit }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.customer.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
