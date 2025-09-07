// store/auth.state.ts
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../environment/environment';
import { changePassword, Login, Logout, Register } from './auth.actions';
import { SnackbarService } from '../../services/toast.service';

export interface AuthStateModel {
  token: string | null;
  user: any; 
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    token: sessionStorage.getItem(environment.tokenKey),
    user: null,
    isAuthenticated: !!sessionStorage.getItem(environment.tokenKey),
    loading: false,
    error: null
  }
})
@Injectable()
export class AuthState {
  constructor(private http: HttpClient,private toast: SnackbarService) {}

  // Selectors
  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return state.isAuthenticated;
  }

  @Selector()
  static getToken(state: AuthStateModel): string | null {
    return state.token;
  }

  @Selector()
  static getUser(state: AuthStateModel) {
    return state.user;
  }

  @Selector()
  static getError(state: AuthStateModel): string | null {
    return state.error;
  }

  // Actions
  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    ctx.patchState({ loading: true, error: null });

    return this.http.post(`${environment.baseUrl}/User/login`, action.credentials).pipe(
      tap((response: any) => {
        if (response?.token) {
          sessionStorage.setItem(environment.roleKey, response.role);
          sessionStorage.setItem(environment.tokenKey, response.token);
          this.toast.success('Login successful');
          ctx.patchState({
            token: response.token,
            isAuthenticated: true,
            loading: false,
            error: null
          });
        } else {
          this.toast.error('Login failed');
          ctx.patchState({ loading: false, error: 'Invalid login response' });
        }
      }),
      catchError((error) => {
        ctx.patchState({
          loading: false,
          error: error?.error?.message || 'Login failed'
        });
        return of(error); // Prevents breaking the observable chain
      })
    );
  }

  @Action(Register)
  register(ctx: StateContext<AuthStateModel>, action: Register) {
    ctx.patchState({ loading: true, error: null });

    return this.http.post(`${environment.baseUrl}/User/register`, action.data).pipe(
      tap(() => {
        ctx.patchState({ loading: false, error: null });
      }),
      catchError((error) => {
        this.toast.error('Please Enter Valid Data');
        ctx.patchState({
          loading: false,
          error: error?.error?.message || 'Registration failed'
        });
        return of(error);
      })
    );
  }
  

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    sessionStorage.removeItem(environment.tokenKey);
    sessionStorage.removeItem(environment.roleKey);
    this.toast.success('Logged out successfully');
    ctx.setState({
      token: null,
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null
    });
  }

  @Action(changePassword)
  changePassword(ctx: StateContext<AuthStateModel>,action:changePassword) {
  ctx.patchState({ loading: true, error: null });

    return this.http.post(`${environment.baseUrl}/User/change-password`, action.credentials).pipe(
      tap(() => {
        ctx.patchState({ loading: false, error: null });
        this.toast.success('Password changed successfully');
      }),
      catchError((error) => {
        ctx.patchState({
          loading: false,
          error: error?.error?.message || 'Failed To Change Password!'
        });
        return of(error);
      })
    );
  }

}
