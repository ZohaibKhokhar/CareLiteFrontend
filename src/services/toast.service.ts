// src/app/services/snackbar.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string, duration: number = 3000) {
    this.show(message, duration, 'success-snackbar');
  }

  error(message: string, duration: number = 3000) {
    this.show(message, duration, 'error-snackbar');
  }

  private show(message: string, duration: number, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass
    });
  }
}
