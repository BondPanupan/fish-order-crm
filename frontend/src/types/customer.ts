export type Customer = {
  id: string;
  code: string;
  name: string | null;
  creditLimit: string;
  createdAt: string;
  _count: { orders: number };
};

export type CustomerFormState = {
  code: string;
  name: string;
  creditLimit: string;
};

export type CreateCustomerDto = {
  code: string;
  name?: string;
  creditLimit?: number;
};

export type UpdateCustomerDto = CreateCustomerDto;
