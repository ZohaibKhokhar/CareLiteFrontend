// src/app/stores/billing/billing.dtos.ts
export interface BillCreateDto {
  visitId: number;
}

export interface BillLineItemCreateDto {
  billId: number;
  description: string;
  amount: number;
}
