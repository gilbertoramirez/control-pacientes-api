/**
 * Estado posible de una cita médica
 */
export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  MISSED = 'MISSED'
}

/**
 * Entidad de dominio que representa una cita médica
 */
export class Appointment {
  private id: string;
  private patientId: string;
  private doctorId: string;
  private date: Date;
  private duration: number; // Duración en minutos
  private reason: string;
  private status: AppointmentStatus;
  private notes?: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: string,
    patientId: string,
    doctorId: string,
    date: Date,
    duration: number,
    reason: string,
    status: AppointmentStatus = AppointmentStatus.SCHEDULED,
    notes?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.id = id;
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.date = date;
    this.duration = duration;
    this.reason = reason;
    this.status = status;
    this.notes = notes;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getPatientId(): string {
    return this.patientId;
  }

  public getDoctorId(): string {
    return this.doctorId;
  }

  public getDate(): Date {
    return this.date;
  }

  public getDuration(): number {
    return this.duration;
  }

  public getReason(): string {
    return this.reason;
  }

  public getStatus(): AppointmentStatus {
    return this.status;
  }

  public getNotes(): string | undefined {
    return this.notes;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Setters y métodos de actualización
  public setStatus(status: AppointmentStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  public setNotes(notes: string): void {
    this.notes = notes;
    this.updatedAt = new Date();
  }

  public updateDate(date: Date): void {
    this.date = date;
    this.updatedAt = new Date();
  }

  public updateDuration(duration: number): void {
    this.duration = duration;
    this.updatedAt = new Date();
  }

  public updateReason(reason: string): void {
    this.reason = reason;
    this.updatedAt = new Date();
  }

  // Métodos de negocio
  public isScheduled(): boolean {
    return this.status === AppointmentStatus.SCHEDULED;
  }

  public isConfirmed(): boolean {
    return this.status === AppointmentStatus.CONFIRMED;
  }

  public isInProgress(): boolean {
    return this.status === AppointmentStatus.IN_PROGRESS;
  }

  public isCompleted(): boolean {
    return this.status === AppointmentStatus.COMPLETED;
  }

  public isCancelled(): boolean {
    return this.status === AppointmentStatus.CANCELLED;
  }

  public isMissed(): boolean {
    return this.status === AppointmentStatus.MISSED;
  }

  public isActive(): boolean {
    return this.status === AppointmentStatus.SCHEDULED || 
           this.status === AppointmentStatus.CONFIRMED || 
           this.status === AppointmentStatus.IN_PROGRESS;
  }

  public confirm(): void {
    if (this.status !== AppointmentStatus.SCHEDULED) {
      throw new Error('Solo se pueden confirmar citas en estado programado');
    }
    this.setStatus(AppointmentStatus.CONFIRMED);
  }

  public startProgress(): void {
    if (this.status !== AppointmentStatus.CONFIRMED && this.status !== AppointmentStatus.SCHEDULED) {
      throw new Error('Solo se pueden iniciar citas en estado programado o confirmado');
    }
    this.setStatus(AppointmentStatus.IN_PROGRESS);
  }

  public complete(): void {
    if (this.status !== AppointmentStatus.IN_PROGRESS) {
      throw new Error('Solo se pueden completar citas en progreso');
    }
    this.setStatus(AppointmentStatus.COMPLETED);
  }

  public cancel(): void {
    if (this.status === AppointmentStatus.COMPLETED || this.status === AppointmentStatus.MISSED) {
      throw new Error('No se pueden cancelar citas completadas o perdidas');
    }
    this.setStatus(AppointmentStatus.CANCELLED);
  }

  public markAsMissed(): void {
    if (this.status === AppointmentStatus.COMPLETED || this.status === AppointmentStatus.CANCELLED) {
      throw new Error('No se pueden marcar como perdidas citas completadas o canceladas');
    }
    this.setStatus(AppointmentStatus.MISSED);
  }
} 