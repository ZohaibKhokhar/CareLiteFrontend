import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store, Select } from '@ngxs/store';
import { Observable, combineLatest, map, tap } from 'rxjs';
import { Router } from '@angular/router';

import { Visit } from '../../../stores/visit/visit.model';
import { LoadVisits, DeleteVisit, UpdateVisit } from '../../../stores/visit/visit.actions';
import { VisitState } from '../../../stores/visit/visit.state';
import { PatientState } from '../../../stores/Patient/patient.state';
import { ProviderState } from '../../../stores/provider/provider.state';
import { GetPatients } from '../../../stores/Patient/patient.actions';
import { LoadProviders } from '../../../stores/provider/provider.action';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormField, MatFormFieldControl, MatLabel } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-visits',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormField,
    MatLabel,
    MatInputModule
    
  ],
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.scss']
})
export class VisitsComponent implements OnInit {
  @Select(VisitState.visits) visits$!: Observable<Visit[]>;
  @Select(PatientState.getPatients) patients$!: Observable<any[]>;
  @Select(ProviderState.providers) providers$!: Observable<any[]>;

  visitsWithNames$!: Observable<any[]>;
  displayedColumns: string[] = ['id', 'patient', 'provider', 'startTime', 'duration', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadVisits());

    this.patients$.pipe(
      tap(patients => {
        if (!patients || patients.length === 0) this.store.dispatch(new GetPatients());
      })
    ).subscribe();

    this.providers$.pipe(
      tap(providers => {
        if (!providers || providers.length === 0) this.store.dispatch(new LoadProviders());
      })
    ).subscribe();


    


this.visitsWithNames$ = combineLatest([
  this.visits$.pipe(startWith([])),
  this.patients$.pipe(startWith([])),
  this.providers$.pipe(startWith([]))
]).pipe(
  map(([visits, patients, providers]) =>
    visits.map(v => {
      const patient = patients.find(p => p.patientID === v.patientId);
      const provider = providers.find(p => p.providerId === v.providerId);
      return {
        ...v,
        patientName: patient ? patient.patientName : 'Unknown',
        providerName: provider ? `${provider.firstName} ${provider.lastName}` : 'Unknown'
      };
    })
  )
);

    this.visitsWithNames$.subscribe({
      next:data=>{
        this.dataSource.data=data
         this.dataSource.paginator = this.paginator;
   this.dataSource.sort = this.sort;
      }
    })
}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  onDelete(visitId: number) {
    if (confirm('Are you sure you want to delete this visit?')) {
      this.store.dispatch(new DeleteVisit(visitId));
    }
  }

  onStatusChange(visit: Visit | null) {
    if (!visit) return;
    const updatedVisit: Visit = { ...visit, isCompleted: !visit.isCompleted };
    this.store.dispatch(new UpdateVisit(updatedVisit));
    this.store.dispatch(new LoadVisits());
  }

  onUpdate(visitId: number) {
    this.router.navigate(['/update-visit', visitId]);
  }
}
