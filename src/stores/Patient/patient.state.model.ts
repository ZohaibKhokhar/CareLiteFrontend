import { PatientRead } from "../../models/Patient/patient-read.model";
export interface PatientStateModel {
  patients: PatientRead[];
  selectedPatient: PatientRead | null;
  totalCount: number;
  loading: boolean;
  error: string | null;
}
