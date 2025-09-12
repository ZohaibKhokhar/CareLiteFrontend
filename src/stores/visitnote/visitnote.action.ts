export class LoadVisitNotes {
  static readonly type = '[VisitNote] Load VisitNotes';
}

export class GetVisitNoteByVisitId {
  static readonly type = '[VisitNote] Get VisitNote By VisitId';
  constructor(public visitId: number) {}
}

export class AddVisitNote {
  static readonly type = '[VisitNote] Add VisitNote';
  constructor(public visitNote: any) {}
}

export class UpdateVisitNote {
  static readonly type = '[VisitNote] Update VisitNote';
  constructor(public visitNote: any) {}
}

export class DeleteVisitNote {
  static readonly type = '[VisitNote] Delete VisitNote';
  constructor(public visitId: number) {}
}
