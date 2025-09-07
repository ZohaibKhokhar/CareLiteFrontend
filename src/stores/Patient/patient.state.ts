// patient.state.ts
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { PatientStateModel } from './patient.state.model';
import { GetPatients, GetPatientById, AddPatient, UpdatePatient,DeletePatient, SearchPatients } from './patient.actions';
import { environment } from '../../environment/environment';
import { PatientRead } from '../../models/Patient/patient-read.model';
@State<PatientStateModel>({
  name: 'patients',
defaults: {
  patients: [],
  selectedPatient: null,
  totalCount: 0,
  loading: false,
  error: null
}

})
@Injectable()
export class PatientState {
  private apiUrl = `${environment.baseUrl}/Patient`;

  constructor(private http: HttpClient) {}

  // SELECTORS
  @Selector()
  static getPatients(state: PatientStateModel): PatientRead[] {
    return state.patients;
  }

  @Selector()
  static getSelectedPatient(state: PatientStateModel): PatientRead | null {
    return state.selectedPatient;
  }

  @Selector()
  static getLoading(state: PatientStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static getError(state: PatientStateModel): string | null {
    return state.error;
  }
  
  @Selector()
  static getTotalCount(state: PatientStateModel): number {
    return state.totalCount;
  }
  

  // ACTIONS
  @Action(GetPatients)
  getPatients(ctx: StateContext<PatientStateModel>) {
    console.log('fetching data');
    ctx.patchState({ loading: true, error: null });
    return this.http.get<PatientRead[]>(this.apiUrl).pipe(
      tap(patients => {
        ctx.patchState({ patients, loading: false });
        console.log('Patients fetched', patients);
      }),
      catchError(error => {
        ctx.patchState({ error: error.message, loading: false });
        console.log(error);
        return throwError(() => error);
      })
    );
  }

  @Action(GetPatientById)
  getPatientById(ctx: StateContext<PatientStateModel>, { id }: GetPatientById) {
    ctx.patchState({ loading: true, error: null });
    return this.http.get<PatientRead>(`${this.apiUrl}/${id}`).pipe(
      tap(patient => ctx.patchState({ selectedPatient: patient, loading: false })),
      catchError(error => {
        ctx.patchState({ error: error.message, loading: false });
        return throwError(() => error);
      })
    );
  }

  @Action(AddPatient)
  addPatient(ctx: StateContext<PatientStateModel>, { payload }: AddPatient) {
    ctx.patchState({ loading: true, error: null });
    return this.http.post<PatientRead>(this.apiUrl, payload).pipe(
      tap(newPatient => {
        const patients = [...ctx.getState().patients, newPatient];
        ctx.patchState({ patients, loading: false });
      }),
      catchError(error => {
        ctx.patchState({ error: error.message, loading: false });
        return throwError(() => error);
      })
    );
  }

  @Action(UpdatePatient)
  updatePatient(ctx: StateContext<PatientStateModel>, { id, payload }: UpdatePatient) {
    ctx.patchState({ loading: true, error: null });
    return this.http.put<PatientRead>(`${this.apiUrl}/${id}`, payload).pipe(
      tap(updatedPatient => {
        const patients = ctx.getState().patients.map(p =>
          p.patientID === id ? updatedPatient : p
        );
        ctx.patchState({ patients, loading: false });
      }),
      catchError(error => {
        ctx.patchState({ error: error.message, loading: false });
        return throwError(() => error);
      })
    );
  }

  @Action(DeletePatient)
  deletePatient(ctx: StateContext<PatientStateModel>, { id }: DeletePatient) {
    ctx.patchState({ loading: true, error: null });
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const patients = ctx.getState().patients.filter(p => p.patientID !== id);
        ctx.patchState({ patients, loading: false });
      }),
      catchError(error => {
        ctx.patchState({ error: error.message, loading: false });
        return throwError(() => error);
      })
    );
  }

@Action(SearchPatients)
searchPatients(ctx: StateContext<PatientStateModel>, { searchTerm, page, pageSize, sortBy, sortOrder }: SearchPatients) {
  ctx.patchState({ loading: true, error: null });

  const params = new URLSearchParams({
    search: searchTerm,
    page: page.toString(),
    pageSize: pageSize.toString(),
    sortBy,
    sortOrder
  });

  return this.http.get<{ data: PatientRead[], totalCount: number }>(`${this.apiUrl}/search?${params.toString()}`).pipe(
    tap(response => {
      ctx.patchState({ patients: response.data, totalCount: response.totalCount, loading: false });
    }),
    catchError(error => {
      ctx.patchState({ error: error.message, loading: false });
      return throwError(() => error);
    })
  );
}

}
