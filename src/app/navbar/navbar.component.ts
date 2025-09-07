import { Component, importProvidersFrom, inject } from '@angular/core';
import { AuthState } from '../../stores/auth/auth.state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Logout } from '../../stores/auth/auth.actions';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Select(AuthState.isAuthenticated) isLoggedIn$!: Observable<boolean>;
  store=inject(Store);
  router=inject(Router);
  location=inject(Location);
  logout(){
    this.store.dispatch(new Logout());
    this.router.navigate(['/login']);
  }
  navigateHome()
  {
    this.router.navigate(['/dashboard']);
  }
  goBack() {
    this.location.back();
  }
}
