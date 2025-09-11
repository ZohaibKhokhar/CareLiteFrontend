import { Component, OnInit, inject, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, tap } from 'rxjs';
import { Provider } from '../../../stores/provider/provider.model';
import { ProviderState } from '../../../stores/provider/provider.state';
import { LoadProviders } from '../../../stores/provider/provider.action';
import { Visit } from '../../../stores/visit/visit.model';
import { VisitState } from '../../../stores/visit/visit.state';
import { LoadVisitsForWeek } from '../../../stores/visit/visit.actions';

// angular-calendar
import {
  CalendarModule,
  CalendarEvent,
  CalendarEventAction,
} from 'angular-calendar';

@Component({
  selector: 'app-weekly-calendar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
  ],
  templateUrl: './weekly-calendar.component.html',
  styleUrls: ['./weekly-calendar.component.scss'],
})
export class WeeklyCalendarComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  @Select(ProviderState.providers) providers$!: Observable<Provider[]>;
  @Select(VisitState.weeklyVisits) visits$!: Observable<Visit[]>;

  form!: FormGroup;
  viewDate: Date = new Date();
  calendarEvents: CalendarEvent[] = [];

  @ViewChild('eventTemplate', { static: true }) eventTemplate!: TemplateRef<any>;

  ngOnInit(): void {
    this.form = this.fb.group({
      providerId: [null, Validators.required],
      weekStart: [this.toInputDate(this.getWeekStart(new Date())), Validators.required],
    });

    // Load providers if not already loaded
    this.providers$
      .pipe(
        tap((providers: Provider[]) => {
          if (!providers || providers.length === 0) {
            this.store.dispatch(new LoadProviders());
          }
        })
      )
      .subscribe();

    // Map visits to calendar events
    this.visits$.subscribe((visits) => {
      console.log('Visits fetched:', visits);
this.calendarEvents = visits.map((v) => ({
  start: new Date(v.startTime),
  end: new Date(new Date(v.startTime).getTime() + v.durationMinutes * 60000),

  // keep title short
  title: `Visit #${v.visitId}`,

  color: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },

  meta: {
    visitId: v.visitId,
    providerId: v.providerId,
    createdAt: v.createdAt,
    durationMinutes: v.durationMinutes,
    isCompleted: v.isCompleted
  }
}));




      console.log('Calendar events:', this.calendarEvents);
    });

    this.loadWeek();
  }

  loadWeek() {
    const providerId = this.form.get('providerId')?.value;
    const weekStart = this.form.get('weekStart')?.value;

    if (providerId && weekStart) {
      this.viewDate = new Date(weekStart);
      this.store.dispatch(new LoadVisitsForWeek(providerId, weekStart));
    }
  }

  prevWeek() {
    const d = new Date(this.viewDate);
    d.setDate(d.getDate() - 7);
    this.form.patchValue({ weekStart: this.toInputDate(this.getWeekStart(d)) });
    this.loadWeek();
  }

  nextWeek() {
    const d = new Date(this.viewDate);
    d.setDate(d.getDate() + 7);
    this.form.patchValue({ weekStart: this.toInputDate(this.getWeekStart(d)) });
    this.loadWeek();
  }

  private getWeekStart(date: Date): Date {
    const day = date.getDay(); // 0=Sun, 1=Mon
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    return new Date(date.setDate(diff));
  }

  private toInputDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
