import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { Observable, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadProviderSlots, AddVisit, UpdateVisit, ClearProviderSlots, GetVisitById } from '../../../stores/visit/visit.actions';
import { VisitState } from '../../../stores/visit/visit.state';
import { Visit } from '../../../stores/visit/visit.model';
import { Slot } from '../../../models/Slot/Slot.model';
import { PatientRead } from '../../../models/Patient/patient-read.model';
import { Provider } from '../../../stores/provider/provider.model';
import { PatientState } from '../../../stores/Patient/patient.state';
import { ProviderState } from '../../../stores/provider/provider.state';
import { LoadProviders } from '../../../stores/provider/provider.action';
import { GetPatients } from '../../../stores/Patient/patient.actions';

@Component({
  selector: 'app-visit-scheduler',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './visit-scheduler.component.html',
  styleUrls: ['./visit-scheduler.component.scss']
})
export class VisitSchedulerComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  today: string = new Date().toISOString().split('T')[0];
  isEditMode = false;
  form!: FormGroup;
  selectedSlot: Slot | null = null;

  @Select(VisitState.providerSlots) slots$! : Observable<Slot[]>;
  @Select(PatientState.getPatients) patients$!: Observable<PatientRead[]>;
  @Select(ProviderState.providers) providers$!: Observable<Provider[]>;
  @Select(VisitState.selectedVisit) selectedVisit$!: Observable<Visit | null>;

  ngOnInit(): void {
    this.clearSlots();

    this.form = this.fb.group({
      providerId: [null, Validators.required],
      patientId: [null, Validators.required],
      duration: [30, Validators.required],
      date: [this.today, Validators.required]
    });

    this.loadProviders();
    this.loadPatients();

 
    const visitId = this.route.snapshot.paramMap.get('id');
    if (visitId) {
      this.isEditMode = true;
      this.store.dispatch(new GetVisitById(+visitId));
      this.selectedVisit$.subscribe(
        {
          next:visit=>{
            if(visit)
            {
              this.populateForm(visit);
            }
          }
        }
      );

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

      if (this.isEditMode) {
        const updatedVisit: Visit = {
          ...this.store.selectSnapshot(VisitState.selectedVisit)!,
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
          durationMinutes: duration,
          isCompleted:false,
        };
        this.store.dispatch(new AddVisit(newVisit));
      }

      this.router.navigate(['/dashboard']);
    }
  }
}
