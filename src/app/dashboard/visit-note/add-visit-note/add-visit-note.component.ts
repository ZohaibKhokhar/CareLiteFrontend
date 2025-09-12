import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AddVisitNote, GetVisitNoteByVisitId, UpdateVisitNote } from '../../../../stores/visitnote/visitnote.action';
import { VisitNoteCreateDto } from '../../../../stores/visitnote/visitnote-create.dto';
import { VisitNoteReadDto } from '../../../../stores/visitnote/visitnote-read.dto';
import { VisitNoteState } from '../../../../stores/visitnote/visitnote.state';
import { Location } from '@angular/common';


@Component({
  selector: 'app-add-visit-note',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-visit-note.component.html',
  styleUrls: ['./add-visit-note.component.scss']
})
export class AddVisitNoteComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);
  private location=inject(Location);
  @Select(VisitNoteState.selectedVisitNote) note$!: Observable<VisitNoteReadDto | null>;

  form: FormGroup;
  visitId: number;
  isEditMode = false;

  constructor() {
    this.visitId = Number(this.route.snapshot.paramMap.get('visitId'));
    this.form = this.fb.group({
      noteText: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new GetVisitNoteByVisitId(this.visitId));

    this.note$.subscribe(note => {
      if (note) {
        this.isEditMode = true;
        this.form.patchValue({
          noteText: note.noteText
        });
      }
    });
  }

  submit() {
    if (this.form.valid) {
      const dto: VisitNoteCreateDto = {
        visitId: this.visitId,
        noteText: this.form.value.noteText
      };

      const action = this.isEditMode
        ? new UpdateVisitNote(dto)
        : new AddVisitNote(dto);

      this.store.dispatch(action).subscribe(() => {
        this.router.navigate(['/visits']);
      });
    }
  }

  cancel() {
    this.location.back();
  }
}
