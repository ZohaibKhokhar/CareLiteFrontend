export interface PatientRead {
  patientID: number;
  patientName: string;
  patientAddress?: string;
  dateOfBirth?: string; 
  gender?: string;
  phoneNumber?: string;
  email?: string;
  createdAt: Date;     
}
