export type Item = {
  id: string;
  code: string;
  name: string | null;
  unit: string;
};

export type CreateItemDto = {
  code: string;
  name?: string;
  unit?: string;
};

export type UpdateItemDto = Partial<CreateItemDto>;
