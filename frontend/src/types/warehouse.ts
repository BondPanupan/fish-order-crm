export type Warehouse = {
  id: string;
  code: string;
  name: string | null;
  isWildcard: boolean;
  createdAt: string;
};

export type CreateWarehouseDto = {
  code: string;
  name?: string;
  isWildcard?: boolean;
};

export type UpdateWarehouseDto = Partial<CreateWarehouseDto>;
