import type { Item } from './item';
import type { Supplier } from './supplier';
import type { OrderType } from './order-type';

export type PriceRecord = {
  id: string;
  itemId: string;
  supplierId: string;
  orderTypeId: string | null;
  unitPrice: string;
  item: Pick<Item, 'id' | 'code' | 'name' | 'unit'>;
  supplier: Pick<Supplier, 'id' | 'code' | 'name'>;
  orderType: Pick<OrderType, 'id' | 'code' | 'name' | 'percentage'> | null;
};

export type CreatePriceDto = {
  itemId: string;
  supplierId: string;
  orderTypeId?: string | null;
  unitPrice: number;
};

export type UpdatePriceDto = {
  orderTypeId?: string | null;
  unitPrice?: number;
};

export type PriceFormState = {
  itemId: string;
  supplierId: string;
  orderTypeId: string;
  unitPrice: string;
};
