import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from '../../app/orders/dto/create-order.dto';
import { UpdateOrderDto } from '../../app/orders/dto/update-order.dto';

const SUB_ORDER_INCLUDE = {
  item: { select: { id: true, code: true, name: true, unit: true } },
  warehouse: { select: { id: true, code: true, name: true } },
  supplier: { select: { id: true, code: true, name: true } },
  orderType: { select: { id: true, code: true, name: true } },
} as const;

@Injectable()
export class OrderDbService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        code: dto.code,
        customerId: dto.customerId,
        remark: dto.remark,
        subOrders: {
          create: dto.subOrders.map((s, i) => ({
            code: `${dto.code}-${String(i + 1).padStart(3, '0')}`,
            itemId: s.itemId,
            warehouseId: s.warehouseId,
            supplierId: s.supplierId,
            requestQuantity: s.requestQuantity,
            orderTypeId: s.orderTypeId,
            createDate: new Date(s.createDate),
            status: 'pending',
          })),
        },
      },
      include: {
        customer: { select: { id: true, code: true, name: true } },
        subOrders: { include: SUB_ORDER_INCLUDE, orderBy: { code: 'asc' } },
      },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { id: true, code: true, name: true } },
        _count: { select: { subOrders: true } },
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id },
      include: {
        customer: { select: { id: true, code: true, name: true } },
        subOrders: { include: SUB_ORDER_INCLUDE, orderBy: { code: 'asc' } },
      },
    });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  async update(id: string, dto: UpdateOrderDto) {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: { ...(dto.remark !== undefined && { remark: dto.remark }) },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    const subOrders = await this.prisma.subOrder.findMany({ where: { orderId: id }, select: { id: true } });
    const subOrderIds = subOrders.map((s) => s.id);
    return this.prisma.$transaction([
      this.prisma.allocation.deleteMany({ where: { subOrderId: { in: subOrderIds } } }),
      this.prisma.subOrder.deleteMany({ where: { orderId: id } }),
      this.prisma.order.delete({ where: { id } }),
    ]);
  }
}
