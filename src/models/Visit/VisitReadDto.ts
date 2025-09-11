
export interface VisitReadDto {
  visitId: number;
  patientName: string;
  providerName: string;
  startTime: string; // ISO string
  durationMinutes: number;
}
