import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Visit } from './visit.model';
import { AddVisit, DeleteVisit, LoadVisits, LoadProviderSlots,LoadVisitsForWeek } from './visit.actions';
import { Slot } from '../../models/Slot/Slot.model';
import { environment } from '../../environment/environment';
import { ClearProviderSlots } from './visit.actions';
import { SnackbarService } from '../../services/toast.service';
import { UpdateVisit } from './visit.actions';


export interface VisitStateModel {
  visits: Visit[];
  weeklyVisits: Visit[];
  providerSlots: Slot[];
  loading: boolean;
}



@State<VisitStateModel>({
  name: 'visits',
  defaults: {
    weeklyVisits: [],
    visits: [],
    providerSlots: [],
    loading: false,
  }
})
@Injectable()
export class VisitState {
  private apiUrl = `${environment.baseUrl}/Visit`;

  constructor(private http: HttpClient,private toast:SnackbarService) {}


   @Selector()
  static weeklyVisits(state: VisitStateModel) {
    return state.weeklyVisits;
  }


  @Selector()
  static visits(state: VisitStateModel) {
    return state.visits;
  }

  @Selector()
  static providerSlots(state: VisitStateModel) {
    return state.providerSlots;
  }


  @Action(LoadVisits)
  loadVisits(ctx: StateContext<VisitStateModel>) {
    ctx.patchState({ loading: true });
    return this.http.get<Visit[]>(this.apiUrl).pipe(
      tap(visits => ctx.patchState({ visits, loading: false }))
    );
  }

@Action(LoadProviderSlots)
loadProviderSlots(ctx: StateContext<VisitStateModel>, action: LoadProviderSlots) {
  ctx.patchState({ loading: true });

  return this.http.get<Slot[]>(
    `${this.apiUrl}/provider/${action.providerId}/slots?date=${action.date}&duration=${action.duration}`
  ).pipe(
    tap(slots => ctx.patchState({ providerSlots: slots, loading: false }))
  );
}


  @Action(AddVisit)
  addVisit(ctx: StateContext<VisitStateModel>, action: AddVisit) {
    return this.http.post<Visit>(this.apiUrl, action.visit).pipe(
      tap(newVisit => {
        this.toast.success('Visit added successfully');
        const state = ctx.getState();
        ctx.patchState({ visits: [...state.visits, newVisit] });
      })
    );
  }


  @Action(UpdateVisit)
updateVisit(ctx: StateContext<VisitStateModel>, action: UpdateVisit) {
  return this.http.put<Visit>(`${this.apiUrl}/${action.visit.visitId}`, action.visit).pipe(
    tap(updatedVisit => {
      this.toast.success('Visit updated successfully');
      const state = ctx.getState();
      ctx.patchState({
        visits: state.visits.map(v => v.visitId === updatedVisit.visitId ? updatedVisit : v)
      });
    })
  );
}


  @Action(DeleteVisit)
  deleteVisit(ctx: StateContext<VisitStateModel>, action: DeleteVisit) {
    return this.http.delete<void>(`${this.apiUrl}/${action.visitId}`).pipe(
      tap(() => {
        const state = ctx.getState();
        ctx.patchState({ visits: state.visits.filter(v => v.visitId !== action.visitId) });
      })
    );
  }

   @Action(LoadVisitsForWeek)
  loadVisitsForWeek(ctx: StateContext<VisitStateModel>, action: LoadVisitsForWeek) {
    ctx.patchState({ loading: true });
    return this.http
      .get<Visit[]>(`${this.apiUrl}/week?providerId=${action.providerId}&weekStart=${action.weekStart}`)
      .pipe(
        tap(visits => {
          ctx.patchState({ weeklyVisits: visits, loading: false });
        })
      );
  }


  @Action(ClearProviderSlots)
  clearProviderSlots(ctx: StateContext<VisitStateModel>) {
  ctx.patchState({ providerSlots: [] });
   }

}
