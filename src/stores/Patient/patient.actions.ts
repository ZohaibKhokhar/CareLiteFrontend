import { PatientCreate } from "../../models/Patient/patient-create.model";


export class GetPatients {
  static readonly type = '[Patient] Get All';
}

export class GetPatientById {
  static readonly type = '[Patient] Get By Id';
  constructor(public id: number) {}
}

export class AddPatient {
  static readonly type = '[Patient] Add';
  constructor(public payload: PatientCreate) {}
}

export class UpdatePatient {
  static readonly type = '[Patient] Update';
  constructor(public id: number, public payload: PatientCreate) {}
}

export class DeletePatient {
  static readonly type = '[Patient] Delete';
  constructor(public id: number) {}
}


export class SearchPatients {
  static readonly type = '[Patient] Search';
  constructor(
    public searchTerm: string = '',
    public page: number = 1,
    public pageSize: number = 10,
    public sortBy: string = 'PatientName',
    public sortOrder: 'asc' | 'desc' = 'asc'
  ) {}
}
