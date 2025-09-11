import { Visit } from './visit.model';

export class LoadVisits {
  static readonly type = '[Visits] Load All';
}

export class LoadProviderSlots {
  static readonly type = '[Visit] Load Provider Slots';
  constructor(
    public providerId: number,
    public duration: number,
    public date: string   
  ) {}
}

export class LoadVisitsForWeek {
  static readonly type = '[Visit] Load Visits For Week';
  constructor(public providerId: number, public weekStart: string) {} 
}

export class GetVisitById {
  static readonly type = '[Visit] Get Visit By Id';
  constructor(public visitId: number) {}
}


export class AddVisit {
  static readonly type = '[Visits] Add';
  constructor(public visit: Omit<Visit, 'visitId'>) {}
}
export class UpdateVisit {
  static readonly type = '[Visit] Update';
  constructor(public visit: Visit) {}
}


export class DeleteVisit {
  static readonly type = '[Visits] Delete';
  constructor(public visitId: number) {}
}

export class ClearProviderSlots {
  static readonly type = '[Visit] Clear Provider Slots';
}
