import { PatientRead } from "../../models/Patient/patient-read.model";
export interface PatientStateModel {
  patients: PatientRead[];
  selectedPatient: PatientRead | null;
  loading: boolean;
  error: string | null;
}
