// src/app/stores/billing/billing.state.ts
import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environment/environment';
import { SnackbarService } from '../../services/toast.service';
import { Bill } from './billing.model';
import { GenerateBill, GetBill, AddBillLineItem, FinalizeBill } from './billing.actions';
import { BillCreateDto, BillLineItemCreateDto } from '../../models/billing/billing.dtos';
export interface BillingStateModel {
  currentBill: Bill | null;
  loading: boolean;
  error: string | null;
}

@State<BillingStateModel>({
  name: 'billing',
  defaults: {
    currentBill: null,
    loading: false,
    error: null
  }
})
@Injectable()
export class BillingState {
  private apiUrl = `${environment.baseUrl}/Billing`;

  constructor(private http: HttpClient, private toast: SnackbarService) {}

  // ===== SELECTORS =====
  @Selector()
  static currentBill(state: BillingStateModel) {
    return state.currentBill;
  }

  @Selector()
  static loading(state: BillingStateModel) {
    return state.loading;
  }

  @Selector()
  static error(state: BillingStateModel) {
    return state.error;
  }

  // ===== ACTIONS =====

  @Action(GenerateBill)
  generateBill(ctx: StateContext<BillingStateModel>, action: GenerateBill) {
    ctx.patchState({ loading: true, error: null });
    return this.http.post<Bill>(`${this.apiUrl}/generate`, action.payload).pipe(
      tap(bill => {
        this.toast.success('Bill generated successfully');
        ctx.patchState({ currentBill: bill, loading: false });
      }),
      catchError(err => {
        const errorMsg = err?.error?.message || 'Failed to generate bill';
        this.toast.error(errorMsg);
        ctx.patchState({ error: errorMsg, loading: false });
        return throwError(() => err);
      })
    );
  }

  @Action(GetBill)
  getBill(ctx: StateContext<BillingStateModel>, action: GetBill) {
    ctx.patchState({ loading: true, error: null });
    return this.http.get<Bill>(`${this.apiUrl}/${action.billId}`).pipe(
      tap(bill => {
        ctx.patchState({ currentBill: bill, loading: false });
      }),
      catchError(err => {
        const errorMsg = err?.error?.message || 'Failed to load bill';
        this.toast.error(errorMsg);
        ctx.patchState({ error: errorMsg, loading: false });
        return throwError(() => err);
      })
    );
  }

  @Action(AddBillLineItem)
  addBillLineItem(ctx: StateContext<BillingStateModel>, action: AddBillLineItem) {
    return this.http.post<void>(`${this.apiUrl}/lineitem`, action.payload).pipe(
      tap(() => {
        this.toast.success('Line item added successfully');
        const state = ctx.getState();
        if (state.currentBill) {
          ctx.patchState({
            currentBill: {
              ...state.currentBill,
              lineItems: [
                ...state.currentBill.lineItems,
                { lineItemId: Date.now(), ...action.payload } // optimistic update
              ]
            }
          });
        }
      }),
      catchError(err => {
        const errorMsg = err?.error?.message || 'Failed to add line item';
        this.toast.error(errorMsg);
        ctx.patchState({ error: errorMsg });
        return throwError(() => err);
      })
    );
  }

  @Action(FinalizeBill)
  finalizeBill(ctx: StateContext<BillingStateModel>, action: FinalizeBill) {
    return this.http.post<void>(`${this.apiUrl}/finalize/${action.billId}`, {}).pipe(
      tap(() => {
        this.toast.success('Bill finalized successfully');
        const state = ctx.getState();
        if (state.currentBill) {
          ctx.patchState({
            currentBill: { ...state.currentBill, isFinalized: true }
          });
        }
      }),
      catchError(err => {
        const errorMsg = err?.error?.message || 'Failed to finalize bill';
        this.toast.error(errorMsg);
        ctx.patchState({ error: errorMsg });
        return throwError(() => err);
      })
    );
  }
}
