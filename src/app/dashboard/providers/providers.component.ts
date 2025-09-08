import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Provider } from '../../../stores/provider/provider.model';
import { ProviderState } from '../../../stores/provider/provider.state';
import { LoadProviders, DeleteProvider, UpdateProvider } from '../../../stores/provider/provider.action';

@Component({
  selector: 'app-providers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss']
})
export class ProvidersComponent implements OnInit {
  private store = inject(Store);

  @Select(ProviderState.providers) providers$!: Observable<Provider[]>;
  @Select(ProviderState.loading) loading$!: Observable<boolean>;

  ngOnInit() {
    this.store.dispatch(new LoadProviders());
  }

  editProvider(providerId: number) {
    // navigation or emit event — handled elsewhere
    console.log('Edit provider with ID:', providerId);
  }

  deleteProvider(id: number) {
    this.store.dispatch(new DeleteProvider(id));
  }

  addProvider() {
    // navigation or emit event — handled in separate component
    console.log('Navigate to Add Provider form');
  }
}
