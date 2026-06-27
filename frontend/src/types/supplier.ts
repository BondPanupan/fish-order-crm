export type Supplier = {
  id: string;
  code: string;
  name: string | null;
  isWildcard: boolean;
  createdAt: string;
};

export type CreateSupplierDto = {
  code: string;
  name?: string;
  isWildcard?: boolean;
};

export type UpdateSupplierDto = Partial<CreateSupplierDto>;
