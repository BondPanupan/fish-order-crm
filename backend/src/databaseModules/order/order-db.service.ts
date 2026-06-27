import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from '../../app/orders/dto/create-order.dto';
import { UpdateOrderDto } from '../../app/orders/dto/update-order.dto';

const SUB_ORDER_INCLUDE = {
  item: { select: { id: true, code: true, name: true, unit: true } },
  warehouse: { select: { id: true, code: true, name: true } },
  supplier: { select: { id: true, code: true, name: true } },
  orderType: { select: { id: true, code: true, name: true, percentage: true } },
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
        customer: { select: { id: true, code: true, name: true, creditLimit: true } },
        subOrders: { include: SUB_ORDER_INCLUDE, orderBy: { code: 'asc' } },
      },
    });
  }

  async findAll() {
    const orders = await this.prisma.order.findMany({
      include: {
        customer: { select: { id: true, code: true, name: true, creditLimit: true } },
        _count: { select: { subOrders: true } },
        subOrders: {
          select: { orderType: { select: { id: true, code: true, name: true, priority: true } } },
        },
      },
    });

    return orders
      .sort((a, b) => {
        const minPriorityA = a.subOrders.length
          ? Math.min(...a.subOrders.map((s) => s.orderType.priority))
          : Number.MAX_SAFE_INTEGER;
        const minPriorityB = b.subOrders.length
          ? Math.min(...b.subOrders.map((s) => s.orderType.priority))
          : Number.MAX_SAFE_INTEGER;

        if (minPriorityA !== minPriorityB) return minPriorityA - minPriorityB;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      })
      .map(({ subOrders, ...order }) => ({
        ...order,
        orderTypes: [
          ...new Map(subOrders.map((s) => [s.orderType.id, s.orderType])).values(),
        ].map(({ id: _id, priority: _p, ...ot }) => ot),
      }));
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id },
      include: {
        customer: { select: { id: true, code: true, name: true, creditLimit: true } },
        subOrders: { include: SUB_ORDER_INCLUDE, orderBy: { code: 'asc' } },
      },
    });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    if (order.subOrders.length === 0) return { ...order, subOrders: [] };

    // Batch-fetch exact prices (item + supplier + specific order type)
    const exactPrices = await this.prisma.price.findMany({
      where: {
        OR: order.subOrders.map((s) => ({
          itemId: s.itemId,
          supplierId: s.supplierId,
          orderTypeId: s.orderTypeId,
        })),
      },
    });
    const exactMap = new Map(
      exactPrices.map((p) => [`${p.itemId}:${p.supplierId}:${p.orderTypeId}`, Number(p.unitPrice)]),
    );

    // For lines without an exact price, fetch base prices (orderTypeId = null) and apply percentage
    const needBase = order.subOrders.filter(
      (s) => !exactMap.has(`${s.itemId}:${s.supplierId}:${s.orderTypeId}`),
    );
    const basePriceMap = new Map<string, number>();
    if (needBase.length > 0) {
      const basePrices = await this.prisma.price.findMany({
        where: {
          orderTypeId: null,
          OR: needBase.map((s) => ({ itemId: s.itemId, supplierId: s.supplierId })),
        },
      });
      for (const p of basePrices) {
        basePriceMap.set(`${p.itemId}:${p.supplierId}`, Number(p.unitPrice));
      }
    }

    const subOrders = order.subOrders.map((sub) => {
      const exact = exactMap.get(`${sub.itemId}:${sub.supplierId}:${sub.orderTypeId}`);
      let unitPrice: number | null = null;
      if (exact !== undefined) {
        unitPrice = exact;
      } else {
        const base = basePriceMap.get(`${sub.itemId}:${sub.supplierId}`);
        if (base !== undefined) {
          unitPrice = base * (Number(sub.orderType.percentage) / 100);
        }
      }
      const qty = Number(sub.requestQuantity);
      return {
        ...sub,
        unitPrice,
        totalPrice: unitPrice !== null ? unitPrice * qty : null,
      };
    });

    return { ...order, subOrders };
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
