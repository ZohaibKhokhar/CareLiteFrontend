import { Component } from '@angular/core';
import { environment } from '../../environment/environment';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
   userRole:string|null=sessionStorage.getItem(environment.roleKey);
}
