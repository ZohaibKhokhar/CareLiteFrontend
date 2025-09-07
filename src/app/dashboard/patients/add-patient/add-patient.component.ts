import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Store, Select } from '@ngxs/store';
import { AddPatient,UpdatePatient,GetPatientById } from '../../../../stores/Patient/patient.actions';
import { PatientState } from '../../../../stores/Patient/patient.state';
import { Observable } from 'rxjs';
import { PatientRead } from '../../../../models/Patient/patient-read.model';
import { AlphaSpaceOnlyDirective } from '../../../../directives/alpha-space-only.directive';
import { SnackbarService } from '../../../../services/toast.service';
@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlphaSpaceOnlyDirective],
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.scss'
})
export class AddPatientComponent implements OnInit {
  patientForm!: FormGroup;
  isEditMode = false;
  patientId!: number;
  genders = ['Male', 'Female', 'Other'];

  @Select(PatientState.getSelectedPatient) patient$!: Observable<PatientRead | null>;
  @Select(PatientState.getLoading) loading$!: Observable<boolean>;
  @Select(PatientState.getError) error$!: Observable<string | null>;

  private fb = inject(FormBuilder);
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private toast = inject(SnackbarService);

  ngOnInit() {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.patientId;

     this.patientForm = this.fb.group({
      patientName: ['', [Validators.required, Validators.maxLength(100)]],
      patientAddress: ['', Validators.maxLength(200)],
      dateOfBirth: [null, Validators.required],
      gender: ['', Validators.required],
      phoneNumber: ['', [Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      email: ['', [Validators.email]]
    });

    if (this.isEditMode) {
      this.store.dispatch(new GetPatientById(this.patientId));
      this.patient$.subscribe(patient => {
        if (patient) {
          this.patientForm.patchValue(patient);
        }
      });
    }
  }

  navigateBack() {
    this.location.back();
  }

  onSubmit() {
    if (this.patientForm.invalid) return;

    const patientData = this.patientForm.value;

    if (this.isEditMode) {
      this.store.dispatch(new UpdatePatient(this.patientId, patientData)).subscribe({
        next: () =>{
          this.router.navigate(['/patients']);
          this.toast.success('Patient updated successfully');
        },
        error: () => this.toast.error('Failed to update patient')
      });
    } else {
      this.store.dispatch(new AddPatient(patientData)).subscribe({
        next: () => {
          this.router.navigate(['/patients']);
          this.toast.success('Patient added successfully');
        },
        error: () => this.toast.error('Failed to add patient')
      });
    }
  }
}
