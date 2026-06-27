export type SubOrderRecord = {
  id: string;
  code: string;
  orderId: string;
  requestQuantity: string;
  createDate: string;
  status: string;
  item: { id: string; code: string; name: string | null; unit: string };
  warehouse: { id: string; code: string; name: string | null };
  supplier: { id: string; code: string; name: string | null };
  orderType: { id: string; code: string; name: string | null };
};

export type OrderRecord = {
  id: string;
  code: string;
  customerId: string;
  remark: string | null;
  createdAt: string;
  customer: { id: string; code: string; name: string | null };
  _count?: { subOrders: number };
  subOrders?: SubOrderRecord[];
};

export type SubOrderFormLine = {
  itemId: string;
  warehouseId: string;
  supplierId: string;
  requestQuantity: string;
  orderTypeId: string;
  createDate: string;
};

export type OrderFormState = {
  code: string;
  customerId: string;
  remark: string;
  subOrders: SubOrderFormLine[];
};

export type CreateOrderDto = {
  code: string;
  customerId: string;
  remark?: string;
  subOrders: {
    itemId: string;
    warehouseId: string;
    supplierId: string;
    requestQuantity: number;
    orderTypeId: string;
    createDate: string;
  }[];
};

export type UpdateOrderDto = {
  remark?: string;
};
