import type { Item } from './item';
import type { Supplier } from './supplier';
import type { Warehouse } from './warehouse';

export type InventoryRecord = {
  id: string;
  supplierId: string;
  warehouseId: string;
  itemId: string;
  remainingQuantity: string;
  updatedAt: string;
  item: Pick<Item, 'id' | 'code' | 'name' | 'unit'>;
  supplier: Pick<Supplier, 'id' | 'code' | 'name'>;
  warehouse: Pick<Warehouse, 'id' | 'code' | 'name'>;
};

export type CreateInventoryDto = {
  supplierId: string;
  warehouseId: string;
  itemId: string;
  remainingQuantity?: number;
};

export type UpdateInventoryDto = Partial<CreateInventoryDto>;

export type InventoryFormState = {
  supplierId: string;
  warehouseId: string;
  itemId: string;
  remainingQuantity: string;
};
