export interface VisitWithNames {
  visitId: number;
  patientId: number;
  providerId: number;
  patientName: string;
  providerName: string;
  startTime: string;
  durationMinutes: number;
  createdAt: string;
  isCompleted:boolean;
}
