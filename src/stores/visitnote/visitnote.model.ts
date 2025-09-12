export interface VisitNote {
  visitNoteId: number;
  visitId: number;
  noteText: string;
  createdAt: string;
  updatedAt?: string;
  isFinalized: boolean;
}
