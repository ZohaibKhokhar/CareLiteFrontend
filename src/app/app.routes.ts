import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from '../guard/auth.guard';
import { PatientsComponent } from './dashboard/patients/patients.component';
import { AddPatient } from '../stores/Patient/patient.actions';
import { AddPatientComponent } from './dashboard/patients/add-patient/add-patient.component';
import { ProvidersComponent } from './dashboard/providers/providers.component';
import { VisitSchedulerComponent } from './dashboard/visit-scheduler/visit-scheduler.component';
import { WeeklyCalendarComponent } from './dashboard/weekly-calendar/weekly-calendar.component';
import { VisitsComponent } from './dashboard/visits/visits.component';
import { AddVisit } from '../stores/visit/visit.actions';
import { VisitNoteComponent } from './dashboard/visit-note/visit-note.component';
import { AddVisitNote } from '../stores/visitnote/visitnote.action';
import { AddVisitNoteComponent } from './dashboard/visit-note/add-visit-note/add-visit-note.component';
export const routes: Routes = [
    {path:'login',component:LoginComponent} ,
    {path:'register',component:RegisterComponent},
    {path:'dashboard',component:DashboardComponent ,canActivate:[AuthGuard],data:{ roles: ['Admin','Staff','Clinician'] }},
    {path:'',component:LoginComponent,pathMatch:'full'},
    {path:'patients',component:PatientsComponent,canActivate:[AuthGuard],data:{ roles: ['Staff'] }},
    {path:'patients/add',component:AddPatientComponent,canActivate:[AuthGuard],data:{ roles: [,'Staff'] }},
    {path:'patients/update/:id',component:AddPatientComponent,canActivate:[AuthGuard],data:{ roles: ['Staff',] }},
    {path:'providers',component:ProvidersComponent,canActivate:[AuthGuard]},
    {path:'visit-scheduler',component:VisitSchedulerComponent,canActivate:[AuthGuard]},
    {path:'weekly-calender',component:WeeklyCalendarComponent,canActivate:[AuthGuard]},
    {path:'visits',component:VisitsComponent,canActivate:[AuthGuard],pathMatch:"full"},
    {path:'update-visit/:id',component:VisitSchedulerComponent,canActivate:[AuthGuard]},
    {path:'visit-note/:visitId/:completed',component:VisitNoteComponent,canActivate:[AuthGuard]},
    {path:'add-note/:visitId',component:AddVisitNoteComponent,canActivate:[AuthGuard],pathMatch:'full'},
    {path:'**',component:NotFoundComponent }
];
