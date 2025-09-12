import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { VisitNoteReadDto } from '../../../stores/visitnote/visitnote-read.dto';
import { GetVisitNoteByVisitId } from '../../../stores/visitnote/visitnote.action';
import { VisitNoteState } from '../../../stores/visitnote/visitnote.state';
import { DatePipe, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { DeleteVisitNote } from '../../../stores/visitnote/visitnote.action';
@Component({
  selector: 'app-visit-note',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './visit-note.component.html',
  styleUrls: ['./visit-note.component.scss']
})
export class VisitNoteComponent implements OnInit {
  @Select(VisitNoteState.selectedVisitNote) visitNote$!: Observable<VisitNoteReadDto | null>;

  visitId!: number;
  completed!: boolean;
  router:Router=inject(Router);
  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit(): void {
    this.visitId = Number(this.route.snapshot.paramMap.get('visitId'));
    this.completed = this.route.snapshot.paramMap.get('completed') === 'true';

    if (this.visitId && this.completed) {
      console.log(this.visitId);
      this.store.dispatch(new GetVisitNoteByVisitId(this.visitId));
    }
  }

  addNote() {
    this.router.navigate(['/add-note',this.visitId]);
  }

  updateNote(){
    this.router.navigate(['/add-note',this.visitId]);
  }
  deleteNote(noteID:number){
    //delete logic will be here after some time 
    if(confirm('do you want to delete it '))
    {
      this.store.dispatch(new DeleteVisitNote(noteID));
    }
  }
}
