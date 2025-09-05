import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { PatientRead } from '../../../models/Patient/patient-read.model';
import { GetPatients,DeletePatient } from '../../../stores/Patient/patient.actions';
import { PatientState } from '../../../stores/Patient/patient.state';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.scss'
})
export class PatientsComponent implements OnInit {
  @Select(PatientState.getPatients) patients$!: Observable<PatientRead[]>;
  @Select(PatientState.getLoading) isLoading$!: Observable<boolean>;
  @Select(PatientState.getError) errorMessage$!: Observable<string | null>;

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.store.dispatch(new GetPatients());
  }
  
  deletePatient(id: number) {
      if(!confirm('Are you sure you want to delete this patient?')) 
      return;
    this.store.dispatch(new DeletePatient(id));
  }

  updatePatient(id: number) {
    this.router.navigate(['/patients/update', id]);
  }

  navigateToAddPatient() {
    this.router.navigate(['/patients/add']);
  }
}
