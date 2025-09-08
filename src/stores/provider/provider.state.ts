import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';

import { Provider } from './provider.model';

import {
  LoadProviders,
  GetProviderById,
  AddProvider,
  UpdateProvider,
  DeleteProvider
} from './provider.action';

export interface ProviderStateModel {
  providers: Provider[];
  selectedProvider: Provider | null;
  loading: boolean;
}

@State<ProviderStateModel>({
  name: 'providers',
  defaults: {
    providers: [],
    selectedProvider: null,
    loading: false
  }
})
@Injectable()
export class ProviderState {
  private baseUrl = `${environment.baseUrl}/Provider`;

  constructor(private http: HttpClient) {}

  // SELECTORS
  @Selector()
  static providers(state: ProviderStateModel) {
    return state.providers;
  }

  @Selector()
  static selectedProvider(state: ProviderStateModel) {
    return state.selectedProvider;
  }

  @Selector()
  static loading(state: ProviderStateModel) {
    return state.loading;
  }

  // ACTIONS
  @Action(LoadProviders)
  loadProviders(ctx: StateContext<ProviderStateModel>) {
    ctx.patchState({ loading: true });
    return this.http.get<Provider[]>(`${this.baseUrl}`).pipe(
      tap((providers) => {
        ctx.patchState({ providers, loading: false });
      })
    );
  }

  @Action(GetProviderById)
  getProviderById(ctx: StateContext<ProviderStateModel>, action: GetProviderById) {
    ctx.patchState({ loading: true });
    return this.http.get<Provider>(`${this.baseUrl}/${action.id}`).pipe(
      tap((provider) => {
        ctx.patchState({ selectedProvider: provider, loading: false });
      })
    );
  }

  @Action(AddProvider)
  addProvider(ctx: StateContext<ProviderStateModel>, action: AddProvider) {
    ctx.patchState({ loading: true });
    return this.http.post<Provider>(`${this.baseUrl}`, action.provider).pipe(
      tap((newProvider) => {
        const state = ctx.getState();
        ctx.patchState({
          providers: [...state.providers, newProvider],
          loading: false
        });
      })
    );
  }

  @Action(UpdateProvider)
  updateProvider(ctx: StateContext<ProviderStateModel>, action: UpdateProvider) {
    ctx.patchState({ loading: true });
    return this.http.put(`${this.baseUrl}/${action.provider.providerId}`, action.provider).pipe(
      tap(() => {
        const state = ctx.getState();
        const updated = state.providers.map(p =>
          p.providerId === action.provider.providerId ? action.provider : p
        );
        ctx.patchState({ providers: updated, loading: false });
      })
    );
  }

  @Action(DeleteProvider)
  deleteProvider(ctx: StateContext<ProviderStateModel>, action: DeleteProvider) {
    ctx.patchState({ loading: true });
    return this.http.delete(`${this.baseUrl}/${action.id}`).pipe(
      tap(() => {
        const state = ctx.getState();
        const filtered = state.providers.filter(p => p.providerId !== action.id);
        ctx.patchState({ providers: filtered, loading: false });
      })
    );
  }
}
