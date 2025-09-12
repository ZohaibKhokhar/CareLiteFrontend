import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVisitNoteComponent } from './add-visit-note.component';

describe('AddVisitNoteComponent', () => {
  let component: AddVisitNoteComponent;
  let fixture: ComponentFixture<AddVisitNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVisitNoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddVisitNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
