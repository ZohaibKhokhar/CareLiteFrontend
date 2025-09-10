export interface Visit {
  visitId: number;
  patientId: number;
  providerId: number;
  startTime: string; // ISO string
  durationMinutes: number;
  createdAt?: string;
}
