import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Provider } from '../../../stores/provider/provider.model';
import { ProviderState } from '../../../stores/provider/provider.state';
import { LoadProviders } from '../../../stores/provider/provider.action';
import { VisitState } from '../../../stores/visit/visit.state';
import { LoadVisitsForWeek } from '../../../stores/visit/visit.actions';
import { Visit } from '../../../stores/visit/visit.model';


@Component({
  selector: 'app-weekly-calendar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './weekly-calendar.component.html',
  styleUrls: ['./weekly-calendar.component.scss']
})
export class WeeklyCalendarComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  weekDays: Date[] = [];

  @Select(ProviderState.providers) providers$!: Observable<Provider[]>;
  @Select(VisitState.weeklyVisits) visits$!: Observable<Visit[]>;

  form!: FormGroup;
  currentWeekStart!: Date;

  ngOnInit(): void {
    this.form = this.fb.group({
      providerId: [null, Validators.required],
      weekStart: [null, Validators.required]
    });

    this.currentWeekStart = this.getWeekStart(new Date());
    this.form.patchValue({ weekStart: this.toInputDate(this.currentWeekStart) });

    this.store.dispatch(new LoadProviders());
    this.updateWeekDays();
  }

  loadWeek() {
    const providerId = this.form.get('providerId')?.value;
    const weekStart = this.form.get('weekStart')?.value;

    if (providerId && weekStart) {
      this.store.dispatch(new LoadVisitsForWeek(providerId, weekStart));
    }
  }

  private updateWeekDays() {
  const start = new Date(this.form.get('weekStart')?.value);
  this.weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

private shiftWeek(days: number) {
  const date = new Date(this.form.get('weekStart')?.value);
  date.setDate(date.getDate() + days);
  const newStart = this.getWeekStart(date);
  this.form.patchValue({ weekStart: this.toInputDate(newStart) });

  this.updateWeekDays();  
  this.loadWeek();
}


  nextWeek() {
    this.shiftWeek(7);
  }

  prevWeek() {
    this.shiftWeek(-7);
  }

  private getWeekStart(date: Date): Date {
    const day = date.getDay(); // 0=Sun, 1=Mon
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // start from Monday
    return new Date(date.setDate(diff));
  }

  private toInputDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getWeekDays(): Date[] {
  const start = new Date(this.form.get('weekStart')?.value);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
  }
getTimeSlots(): { label: string; start: string; end: string }[] {
  const slots: { label: string; start: string; end: string }[] = [];
  const addSlots = (startHour: number, endHour: number) => {
    for (let h = startHour; h < endHour; h++) {
      slots.push({
        label: `${h}:00`,
        start: `${h.toString().padStart(2, '0')}:00`,
        end: `${(h + 1).toString().padStart(2, '0')}:00`
      });
    }
  };
  addSlots(9, 13);  // Morning
  addSlots(14, 18); // Afternoon
  return slots;
}

isVisitInCell(visit: Visit, day: Date, slot: { start: string; end: string }): boolean {
  const visitDate = new Date(visit.startTime);
  const sameDay = visitDate.toDateString() === day.toDateString();

  const startTime = parseInt(slot.start.split(':')[0], 10);
  return sameDay && visitDate.getHours() === startTime;
}

  }
