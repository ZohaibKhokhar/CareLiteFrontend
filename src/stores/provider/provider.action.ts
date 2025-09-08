import { Provider } from './provider.model';

export class LoadProviders {
  static readonly type = '[Provider] Load All';
}

export class GetProviderById {
  static readonly type = '[Provider] Get By Id';
  constructor(public id: number) {}
}

export class AddProvider {
  static readonly type = '[Provider] Add';
  constructor(public provider: Partial<Provider>) {}
}

export class UpdateProvider {
  static readonly type = '[Provider] Update';
  constructor(public provider: Provider) {}
}

export class DeleteProvider {
  static readonly type = '[Provider] Delete';
  constructor(public id: number) {}
}
