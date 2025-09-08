
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from '../stores/auth/auth.state';
import { PatientState } from '../stores/Patient/patient.state';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ProviderState } from '../stores/provider/provider.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), 
    importProvidersFrom(
      NgxsModule.forRoot([AuthState, PatientState,ProviderState])
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideAnimationsAsync()
  ]
};
