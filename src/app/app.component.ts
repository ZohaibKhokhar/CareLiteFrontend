import { Component, Inject, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthState } from '../stores/auth/auth.state';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Logout } from '../stores/auth/auth.actions';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'CareLite';
  store=inject(Store);
  router=inject(Router);
  @Select(AuthState.isAuthenticated) isLoggedIn$!: Observable<boolean>;

  logout(){
    this.store.dispatch(new Logout());
    this.router.navigate(['/login']);
  }
}
