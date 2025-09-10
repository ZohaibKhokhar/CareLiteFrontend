import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitSchedulerComponent } from './visit-scheduler.component';

describe('VisitSchedulerComponent', () => {
  let component: VisitSchedulerComponent;
  let fixture: ComponentFixture<VisitSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitSchedulerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisitSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
