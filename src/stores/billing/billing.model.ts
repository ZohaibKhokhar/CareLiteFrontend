export interface Bill {
  billId: number;
  visitId: number;
  patientId: number;
  providerId: number;
  billDate: string;
  totalAmount: number;
  isFinalized: boolean;
  lineItems: BillLineItem[];
}

export interface BillLineItem {
  lineItemId: number;
  description: string;
  amount: number;
}