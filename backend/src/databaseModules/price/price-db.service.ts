import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePriceDto } from '../../app/prices/dto/create-price.dto';
import { UpdatePriceDto } from '../../app/prices/dto/update-price.dto';

const include = {
  item: { select: { id: true, code: true, name: true, unit: true } },
  supplier: { select: { id: true, code: true, name: true } },
  orderType: { select: { id: true, code: true, name: true, percentage: true } },
};

@Injectable()
export class PriceDbService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreatePriceDto) {
    return this.prisma.price.create({
      data: {
        itemId: dto.itemId,
        supplierId: dto.supplierId,
        orderTypeId: dto.orderTypeId ?? null,
        unitPrice: dto.unitPrice,
      },
      include,
    });
  }

  findAll() {
    return this.prisma.price.findMany({
      orderBy: [{ item: { code: 'asc' } }, { supplier: { code: 'asc' } }],
      include,
    });
  }

  async findOne(id: string) {
    const price = await this.prisma.price.findUnique({ where: { id }, include });
    if (!price) throw new NotFoundException(`Price ${id} not found`);
    return price;
  }

  async update(id: string, dto: UpdatePriceDto) {
    await this.findOne(id);
    return this.prisma.price.update({
      where: { id },
      data: {
        ...(dto.unitPrice !== undefined && { unitPrice: dto.unitPrice }),
        ...(dto.orderTypeId !== undefined && { orderTypeId: dto.orderTypeId }),
      },
      include,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.price.delete({ where: { id } });
  }
}
