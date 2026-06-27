import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.interface';
import { UpdateCustomerDto } from './dto/update-customer.interface';

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
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        code: true,
        name: true,
        creditLimit: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: { orders: { orderBy: { createdAt: 'desc' } } },
    });
    if (!customer) throw new NotFoundException(`Customer ${id} not found`);
    return customer;
  }

  async findByCode(code: string) {
    const customer = await this.prisma.customer.findUnique({ where: { code } });
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
    return this.prisma.customer.delete({ where: { id } });
  }
}
