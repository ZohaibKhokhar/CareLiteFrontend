import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from '../guard/auth.guard';
import { PatientsComponent } from './dashboard/patients/patients.component';
import { AddPatient } from '../stores/Patient/patient.actions';
import { AddPatientComponent } from './dashboard/patients/add-patient/add-patient.component';

export const routes: Routes = [
    {path:'login',component:LoginComponent} ,
    {path:'register',component:RegisterComponent},
    {path:'dashboard',component:DashboardComponent ,canActivate:[AuthGuard],data:{ roles: ['Admin','Staff','Clinician'] }},
    {path:'',component:LoginComponent,pathMatch:'full'},
    {path:'patients',component:PatientsComponent,canActivate:[AuthGuard],data:{ roles: ['Staff'] }},
    {path:'patients/add',component:AddPatientComponent,canActivate:[AuthGuard],data:{ roles: [,'Staff'] }},
    {path:'patients/update/:id',component:AddPatientComponent,canActivate:[AuthGuard],data:{ roles: ['Staff',] }},
    {path:'**',component:NotFoundComponent }
];
