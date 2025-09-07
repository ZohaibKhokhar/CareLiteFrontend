import { Component, Inject, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthState } from '../stores/auth/auth.state';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Logout } from '../stores/auth/auth.actions';
import { Router } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'CareLite';
  
}
