export interface VisitNoteReadDto {
  visitNoteId: number;
  visitId: number;
  noteText: string;
  createdAt: string;
  updatedAt?: string;
  isFinalized: boolean;
}
