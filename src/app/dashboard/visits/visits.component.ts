import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Visit } from '../../../stores/visit/visit.model';
import { LoadVisits,DeleteVisit } from '../../../stores/visit/visit.actions';
import { VisitState } from '../../../stores/visit/visit.state';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-visits',
  standalone: true,  
  imports: [CommonModule], 
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.scss']
})
export class VisitsComponent implements OnInit {
  @Select(VisitState.visits) visits$!: Observable<Visit[]>;

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadVisits());
  }

  onDelete(visitId: number) {
    if (confirm('Are you sure you want to delete this visit?')) {
      this.store.dispatch(new DeleteVisit(visitId));
    }
  }

  onUpdate(visitId: number) {
    this.router.navigate(['update-visit', visitId]);
  }
}
