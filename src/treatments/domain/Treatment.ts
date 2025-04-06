/**
 * Estado posible de un tratamiento médico
 */
export enum TreatmentStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

/**
 * Tipo de tratamiento médico
 */
export enum TreatmentType {
  MEDICATION = 'MEDICATION',
  PHYSICAL_THERAPY = 'PHYSICAL_THERAPY',
  SURGERY = 'SURGERY',
  PSYCHOLOGICAL = 'PSYCHOLOGICAL',
  NUTRITIONAL = 'NUTRITIONAL',
  ALTERNATIVE = 'ALTERNATIVE',
  OTHER = 'OTHER'
}

/**
 * Entidad de dominio que representa un tratamiento médico
 */
export class Treatment {
  private id: string;
  private patientId: string;
  private doctorId: string;
  private name: string;
  private description: string;
  private type: TreatmentType;
  private status: TreatmentStatus;
  private startDate: Date;
  private endDate?: Date;
  private instructions: string;
  private notes?: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: string,
    patientId: string,
    doctorId: string,
    name: string,
    description: string,
    type: TreatmentType,
    instructions: string,
    startDate: Date,
    endDate?: Date,
    status: TreatmentStatus = TreatmentStatus.ACTIVE,
    notes?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.id = id;
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.name = name;
    this.description = description;
    this.type = type;
    this.instructions = instructions;
    this.startDate = startDate;
    this.endDate = endDate;
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

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public getType(): TreatmentType {
    return this.type;
  }

  public getStatus(): TreatmentStatus {
    return this.status;
  }

  public getStartDate(): Date {
    return this.startDate;
  }

  public getEndDate(): Date | undefined {
    return this.endDate;
  }

  public getInstructions(): string {
    return this.instructions;
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

  // Métodos de actualización
  public updateName(name: string): void {
    this.name = name;
    this.markAsUpdated();
  }

  public updateDescription(description: string): void {
    this.description = description;
    this.markAsUpdated();
  }

  public updateType(type: TreatmentType): void {
    this.type = type;
    this.markAsUpdated();
  }

  public updateInstructions(instructions: string): void {
    this.instructions = instructions;
    this.markAsUpdated();
  }

  public updateDates(startDate: Date, endDate?: Date): void {
    this.startDate = startDate;
    this.endDate = endDate;
    this.markAsUpdated();
  }

  public setEndDate(endDate: Date): void {
    this.endDate = endDate;
    this.markAsUpdated();
  }

  public setNotes(notes: string): void {
    this.notes = notes;
    this.markAsUpdated();
  }

  // Métodos de negocio
  public complete(): void {
    if (this.status === TreatmentStatus.CANCELLED) {
      throw new Error('No se puede completar un tratamiento cancelado');
    }
    this.status = TreatmentStatus.COMPLETED;
    if (!this.endDate) {
      this.endDate = new Date();
    }
    this.markAsUpdated();
  }

  public cancel(reason?: string): void {
    if (this.status === TreatmentStatus.COMPLETED) {
      throw new Error('No se puede cancelar un tratamiento completado');
    }
    this.status = TreatmentStatus.CANCELLED;
    if (reason) {
      const currentNotes = this.notes ? `${this.notes}\n` : '';
      this.notes = `${currentNotes}[Cancelado: ${reason}]`;
    }
    this.markAsUpdated();
  }

  public reactivate(): void {
    if (this.status !== TreatmentStatus.CANCELLED) {
      throw new Error('Solo se pueden reactivar tratamientos cancelados');
    }
    this.status = TreatmentStatus.ACTIVE;
    this.markAsUpdated();
  }

  public isActive(): boolean {
    return this.status === TreatmentStatus.ACTIVE;
  }

  public isCompleted(): boolean {
    return this.status === TreatmentStatus.COMPLETED;
  }

  public isCancelled(): boolean {
    return this.status === TreatmentStatus.CANCELLED;
  }

  private markAsUpdated(): void {
    this.updatedAt = new Date();
  }
} 