/**
 * Representa la entidad de dominio principal de una Prescripción médica
 */
export class Prescription {
  private readonly id: string;
  private patientId: string;
  private doctorId: string;
  private medications: Medication[];
  private issueDate: Date;
  private expirationDate: Date;
  private status: PrescriptionStatus;
  private notes?: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: string,
    patientId: string,
    doctorId: string,
    medications: Medication[],
    issueDate: Date,
    expirationDate: Date,
    status: PrescriptionStatus = PrescriptionStatus.ACTIVE,
    notes?: string
  ) {
    this.id = id;
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.medications = medications;
    this.issueDate = issueDate;
    this.expirationDate = expirationDate;
    this.status = status;
    this.notes = notes;
    this.createdAt = new Date();
    this.updatedAt = new Date();
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

  public getMedications(): Medication[] {
    return [...this.medications];
  }

  public getIssueDate(): Date {
    return new Date(this.issueDate);
  }

  public getExpirationDate(): Date {
    return new Date(this.expirationDate);
  }

  public getStatus(): PrescriptionStatus {
    return this.status;
  }

  public getNotes(): string | undefined {
    return this.notes;
  }

  // Métodos de dominio
  public isValid(): boolean {
    const today = new Date();
    return this.expirationDate >= today && this.status === PrescriptionStatus.ACTIVE;
  }

  public addMedication(medication: Medication): void {
    this.medications.push(medication);
    this.markAsUpdated();
  }

  public removeMedication(medicationId: string): void {
    const index = this.medications.findIndex(med => med.getId() === medicationId);
    if (index !== -1) {
      this.medications.splice(index, 1);
      this.markAsUpdated();
    }
  }

  public fulfill(): void {
    this.status = PrescriptionStatus.FULFILLED;
    this.markAsUpdated();
  }

  public cancel(reason: string): void {
    this.status = PrescriptionStatus.CANCELLED;
    this.addNote(`Cancelada: ${reason}`);
    this.markAsUpdated();
  }

  public renew(newExpirationDate: Date): void {
    if (this.status !== PrescriptionStatus.ACTIVE) {
      throw new Error('Solo se pueden renovar prescripciones activas');
    }
    
    this.expirationDate = newExpirationDate;
    this.addNote(`Renovada hasta: ${newExpirationDate.toISOString().split('T')[0]}`);
    this.markAsUpdated();
  }

  public addNote(note: string): void {
    const timestamp = new Date().toISOString();
    const formattedNote = `[${timestamp}] ${note}`;
    
    if (this.notes) {
      this.notes = `${this.notes}\n${formattedNote}`;
    } else {
      this.notes = formattedNote;
    }
    
    this.markAsUpdated();
  }

  private markAsUpdated(): void {
    this.updatedAt = new Date();
  }
}

/**
 * Estado de la prescripción
 */
export enum PrescriptionStatus {
  ACTIVE = 'ACTIVE',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

/**
 * Representa un medicamento en una prescripción
 */
export class Medication {
  private readonly id: string;
  private name: string;
  private dosage: string;
  private frequency: string;
  private duration: string;
  private instructions: string;
  private quantity: number;
  private isControlledSubstance: boolean;

  constructor(
    id: string,
    name: string,
    dosage: string,
    frequency: string,
    duration: string,
    instructions: string,
    quantity: number,
    isControlledSubstance: boolean = false
  ) {
    this.id = id;
    this.name = name;
    this.dosage = dosage;
    this.frequency = frequency;
    this.duration = duration;
    this.instructions = instructions;
    this.quantity = quantity;
    this.isControlledSubstance = isControlledSubstance;
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getDosage(): string {
    return this.dosage;
  }

  public getFrequency(): string {
    return this.frequency;
  }

  public getDuration(): string {
    return this.duration;
  }

  public getInstructions(): string {
    return this.instructions;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public isControlled(): boolean {
    return this.isControlledSubstance;
  }

  // Métodos de dominio
  public calculateTotalDoses(): number {
    // Este es un cálculo simplificado, en la realidad dependería de una lógica más compleja
    // basada en la frecuencia y duración
    const frequencyPerDay = this.parseFrequency();
    const durationInDays = this.parseDuration();
    
    return frequencyPerDay * durationInDays;
  }

  private parseFrequency(): number {
    // Implementación simplificada
    if (this.frequency.includes('day')) {
      const match = this.frequency.match(/(\d+)/);
      return match ? parseInt(match[1], 10) : 1;
    }
    return 1; // valor por defecto
  }

  private parseDuration(): number {
    // Implementación simplificada
    if (this.duration.includes('day')) {
      const match = this.duration.match(/(\d+)/);
      return match ? parseInt(match[1], 10) : 1;
    }
    if (this.duration.includes('week')) {
      const match = this.duration.match(/(\d+)/);
      return match ? parseInt(match[1], 10) * 7 : 7;
    }
    return 1; // valor por defecto
  }
} 