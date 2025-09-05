export interface PatientCreate {
  patientName: string;
  patientAddress?: string;
  dateOfBirth?: string;   
  gender?: string;
  phoneNumber?: string;
  email?: Date
}
