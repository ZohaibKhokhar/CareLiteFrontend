import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PatientRead } from '../../../models/Patient/patient-read.model';
import { SearchPatients, DeletePatient } from '../../../stores/Patient/patient.actions';
import { PatientState } from '../../../stores/Patient/patient.state';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.scss'
})
export class PatientsComponent implements OnInit, OnDestroy {
  @Select(PatientState.getPatients) patients$!: Observable<PatientRead[]>;
  @Select(PatientState.getLoading) isLoading$!: Observable<boolean>;
  @Select(PatientState.getError) errorMessage$!: Observable<string | null>;
  @Select(PatientState.getTotalCount) totalCount$!: Observable<number>;

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  currentPage = 1;
  pageSize = 10;
  currentSearchTerm = '';
  sortBy = 'PatientName';
  sortOrder: 'asc' | 'desc' = 'asc';

  // Expose Math for template usage (e.g., Math.ceil)
  Math = Math;

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.loadPatients();

    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(searchTerm => {
        this.currentSearchTerm = searchTerm.trim();
        this.currentPage = 1;
        this.loadPatients();
      });
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  loadPatients() {
    this.store.dispatch(
      new SearchPatients(this.currentSearchTerm, this.currentPage, this.pageSize, this.sortBy, this.sortOrder)
    );
  }

  deletePatient(id: number) {
    if (!confirm('Are you sure you want to delete this patient?')) return;

    this.store.dispatch(new DeletePatient(id)).subscribe({
      next: () => {
        this.patients$.pipe(take(1)).subscribe(patients => {
          if (patients.length === 1 && this.currentPage > 1) {
            this.currentPage--;
          }
          this.loadPatients();
        });
      }
    });
  }

  updatePatient(id: number) {
    this.router.navigate(['/patients/update', id]);
  }

  navigateToAddPatient() {
    this.router.navigate(['/patients/add']);
  }

  goToPage(page: number, totalCount: number) {
    const totalPages = Math.ceil(totalCount / this.pageSize);
    if (page >= 1 && page <= totalPages) {
      this.currentPage = page;
      this.loadPatients();
    }
  }

  changeSort(field: string) {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.loadPatients();
  }

  onPageSizeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.pageSize = Number(select.value);
    this.currentPage = 1; // Reset to first page when changing page size
    this.loadPatients();
  }

  onSortChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.sortBy = select.value;
    this.loadPatients();
  }

  onSortOrderChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.sortOrder = select.value as 'asc' | 'desc';
    this.loadPatients();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPatients();
    }
  }

  nextPage(totalCount: number) {
    const totalPages = Math.ceil(totalCount / this.pageSize);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.loadPatients();
    }
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
