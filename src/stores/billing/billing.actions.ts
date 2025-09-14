// src/app/stores/billing/billing.actions.ts
import { BillCreateDto, BillLineItemCreateDto } from '../../models/billing/billing.dtos';
import { Bill } from './billing.model';

export class GenerateBill {
  static readonly type = '[Billing] Generate Bill';
  constructor(public payload: BillCreateDto) {}
}

export class GetBill {
  static readonly type = '[Billing] Get Bill';
  constructor(public billId: number) {}
}

export class AddBillLineItem {
  static readonly type = '[Billing] Add Bill Line Item';
  constructor(public payload: BillLineItemCreateDto) {}
}

export class FinalizeBill {
  static readonly type = '[Billing] Finalize Bill';
  constructor(public billId: number) {}
}
