import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { VisitNoteCreateDto } from './visitnote-create.dto';
import { VisitNoteReadDto } from './visitnote-read.dto';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';


import {
  LoadVisitNotes,
  GetVisitNoteByVisitId,
  AddVisitNote,
  UpdateVisitNote,
  DeleteVisitNote
} from './visitnote.action';

export interface VisitNoteStateModel {
  visitNotes: VisitNoteReadDto[];
  selectedVisitNote: VisitNoteReadDto | null;
  loading: boolean;
}

@State<VisitNoteStateModel>({
  name: 'visitNotes',
  defaults: {
    visitNotes: [],
    selectedVisitNote: null,
    loading: false
  }
})
@Injectable()
export class VisitNoteState {
  private baseUrl = `${environment.baseUrl}/VisitNote`;

  constructor(private http: HttpClient) {}

  // SELECTORS
  @Selector()
  static visitNotes(state: VisitNoteStateModel) {
    return state.visitNotes;
  }

  @Selector()
  static selectedVisitNote(state: VisitNoteStateModel) {
    return state.selectedVisitNote;
  }

  @Selector()
  static loading(state: VisitNoteStateModel) {
    return state.loading;
  }

  // ACTIONS
  @Action(LoadVisitNotes)
  loadVisitNotes(ctx: StateContext<VisitNoteStateModel>) {
    ctx.patchState({ loading: true });
    return this.http.get<VisitNoteReadDto[]>(`${this.baseUrl}`).pipe(
      tap((visitNotes) => ctx.patchState({ visitNotes, loading: false }))
    );
  }


@Action(GetVisitNoteByVisitId)
getVisitNoteByVisitId(ctx: StateContext<VisitNoteStateModel>, action: GetVisitNoteByVisitId) {
  ctx.patchState({ loading: true });

  return this.http.get<VisitNoteReadDto>(`${this.baseUrl}/${action.visitId}`).pipe(
    tap((note) => {
      ctx.patchState({ selectedVisitNote: note, loading: false });
    }),
    catchError((error) => {
      if (error.status === 404) {
        ctx.patchState({ selectedVisitNote: null, loading: false });
      } else {
        ctx.patchState({ loading: false });
        console.error('Error fetching visit note', error);
      }
      return of(null); 
    })
  );
}


  @Action(AddVisitNote)
  addVisitNote(ctx: StateContext<VisitNoteStateModel>, action: AddVisitNote) {
    ctx.patchState({ loading: true });
    return this.http.post<VisitNoteReadDto>(`${this.baseUrl}`, action.visitNote as VisitNoteCreateDto).pipe(
      tap((newNote) => {
        const state = ctx.getState();
        ctx.patchState({
          visitNotes: [...state.visitNotes, newNote],
          loading: false
        });
      })
    );
  }

  @Action(UpdateVisitNote)
  updateVisitNote(ctx: StateContext<VisitNoteStateModel>, action: UpdateVisitNote) {
    ctx.patchState({ loading: true });
    return this.http.put(`${this.baseUrl}/${action.visitNote.visitId}`, action.visitNote as VisitNoteCreateDto).pipe(
      tap(() => {
        const state = ctx.getState();
        const updated = state.visitNotes.map(n =>
          n.visitId === action.visitNote.visitId ? { ...n, noteText: action.visitNote.noteText } : n
        );
        ctx.patchState({ visitNotes: updated, loading: false });
      })
    );
  }

  @Action(DeleteVisitNote)
  deleteVisitNote(ctx: StateContext<VisitNoteStateModel>, action: DeleteVisitNote) {
    ctx.patchState({ loading: true });
    return this.http.delete(`${this.baseUrl}/${action.visitId}`).pipe(
      tap(() => {
        const state = ctx.getState();
        const filtered = state.visitNotes.filter(n => n.visitId !== action.visitId);
        ctx.patchState({ visitNotes: filtered, loading: false });
      })
    );
  }
}
