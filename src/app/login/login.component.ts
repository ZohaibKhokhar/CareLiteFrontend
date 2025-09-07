import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { Login } from '../../stores/auth/auth.actions';
import { AuthState } from '../../stores/auth/auth.state';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { environment } from '../../environment/environment';
import { SnackbarService } from '../../services/toast.service';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule, RouterLink,CommonModule]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  userRole: string = '';
  @Select(AuthState.getError) errorMessage$!: Observable<string | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private toast: SnackbarService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
  if (this.loginForm.valid) {
    this.store.dispatch(new Login(this.loginForm.value)).subscribe({
      next: () => {
        this.userRole = sessionStorage.getItem(environment.roleKey) || '';
        this.router.navigate(['/dashboard']);
      },
      error: () => this.toast.error('Login failed')
    });
  }
}
}
