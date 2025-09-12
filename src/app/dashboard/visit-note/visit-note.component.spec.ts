import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitNoteComponent } from './visit-note.component';

describe('VisitNoteComponent', () => {
  let component: VisitNoteComponent;
  let fixture: ComponentFixture<VisitNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitNoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisitNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
