import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Visit } from '../../../stores/visit/visit.model';
import { DeleteVisit, UpdateVisit, LoadVisitsWithNames } from '../../../stores/visit/visit.actions';
import { VisitState } from '../../../stores/visit/visit.state';
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
import { VisitWithNames } from '../../../stores/visit/visit-with-names.model';
import { UpdateStatus } from '../../../stores/visit/visit.actions';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

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
  @Select(VisitState.visitsWithNames) visits$!:Observable<VisitWithNames[]>;
  displayedColumns: string[] = ['id', 'patient', 'provider', 'startTime', 'duration', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private router: Router,private dialog: MatDialog) {}

  ngOnInit(): void {
   this.store.dispatch(new LoadVisitsWithNames());

    this.visits$.subscribe({
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
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '350px',
    data: { message: 'Are you sure you want to delete this visit?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.store.dispatch(new DeleteVisit(visitId)).subscribe(() => {
        this.store.dispatch(new LoadVisitsWithNames());
      });
    }
  });
}


  onStatusChange(visit: VisitWithNames | null) {
    if (!visit) return;
    console.log('here in on status change ',visit.isCompleted);
    const updatedVisit: Visit = { ...visit, isCompleted: !visit.isCompleted };
    console.log(updatedVisit.isCompleted);
    this.store.dispatch(new UpdateStatus(updatedVisit));
  setTimeout(() => this.store.dispatch(new LoadVisitsWithNames()));
  }

  onUpdate(visitId: number) {
    this.router.navigate(['/update-visit', visitId]);
  }


  navigatetoNote(visitId:number,completed:boolean){
    this.router.navigate(['/visit-note',visitId,completed]);
  }
}
