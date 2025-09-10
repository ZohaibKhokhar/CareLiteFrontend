import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LoadProviderSlots, AddVisit } from '../../../stores/visit/visit.actions';
import { VisitState } from '../../../stores/visit/visit.state';
import { Visit } from '../../../stores/visit/visit.model';
import { Slot } from '../../../models/Slot/Slot.model';
import { PatientRead } from '../../../models/Patient/patient-read.model';
import { Provider } from '../../../stores/provider/provider.model';
import { PatientState } from '../../../stores/Patient/patient.state';
import { ProviderState } from '../../../stores/provider/provider.state';
import { LoadProviders } from '../../../stores/provider/provider.action';
import { GetPatients } from '../../../stores/Patient/patient.actions';
import { ClearProviderSlots } from '../../../stores/visit/visit.actions';
import { Router } from '@angular/router';
import { Input } from '@angular/core';
import { UpdateVisit } from '../../../stores/visit/visit.actions';


@Component({
  selector: 'app-visit-scheduler',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './visit-scheduler.component.html',
  styleUrls: ['./visit-scheduler.component.scss']
})
export class VisitSchedulerComponent implements OnInit {
  @Input() visitToEdit: Visit | null = null; 
  isEditMode = false;

  private store = inject(Store);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  today: any;

  @Select(VisitState.providerSlots) slots$!: Observable<Slot[]>;
  @Select(PatientState.getPatients) patients$!: Observable<PatientRead[]>;
  @Select(ProviderState.providers) providers$!: Observable<Provider[]>;

  form!: FormGroup;
  selectedSlot: Slot | null = null;

  ngOnInit(): void {
    this.clearSlots();
    this.today = new Date().toISOString().split('T')[0];

    this.isEditMode = !!this.visitToEdit;

    this.form = this.fb.group({
      providerId: [null, Validators.required],
      patientId: [null, Validators.required],
      duration: [30, Validators.required],
      date: [this.today, Validators.required]
    });

    this.loadProviders();
    this.loadPatients();

    if (this.isEditMode && this.visitToEdit) {
      this.populateForm(this.visitToEdit);
    }

    this.form.get('providerId')?.valueChanges.subscribe(() => {
      this.selectedSlot = null;
      this.clearSlots();
    });

    this.form.get('date')?.valueChanges.subscribe(() => {
      this.selectedSlot = null;
      this.clearSlots();
    });
  }

  populateForm(visit: Visit) {
    this.form.patchValue({
      providerId: visit.providerId,
      patientId: visit.patientId,
      duration: visit.durationMinutes,
      date: new Date(visit.startTime).toISOString().split('T')[0]
    });

    this.selectedSlot = {
      start: visit.startTime,
      end: new Date(new Date(visit.startTime).getTime() + visit.durationMinutes * 60000).toISOString(),
      isBooked: false
    };
  }

  clearSlots() {
    this.store.dispatch(new ClearProviderSlots());
  }

  loadProviders() {
    this.store.dispatch(new LoadProviders());
  }

  loadPatients() {
    this.store.dispatch(new GetPatients());
  }

  loadSlots() {
    const providerId = this.form.get('providerId')?.value;
    const duration = this.form.get('duration')?.value;
    const date = this.form.get('date')?.value;

    if (providerId && duration && date) {
      this.store.dispatch(new LoadProviderSlots(providerId, duration, date));
    }
  }

  scheduleVisit() {
    if (this.form.valid && this.selectedSlot) {
      const { patientId, providerId, duration } = this.form.value;

      if (this.isEditMode && this.visitToEdit) {
       
        const updatedVisit: Visit = {
          ...this.visitToEdit,
          patientId,
          providerId,
          startTime: this.selectedSlot.start,
          durationMinutes: duration
        };
        this.store.dispatch(new UpdateVisit(updatedVisit)); 
      } else {
     
        const newVisit: Omit<Visit, 'visitId'> = {
          patientId,
          providerId,
          startTime: this.selectedSlot.start,
          durationMinutes: duration
        };
        this.store.dispatch(new AddVisit(newVisit));
      }

      this.router.navigate(['/dashboard']);
    }
  }
}
