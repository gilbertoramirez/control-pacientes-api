/**
 * Representa la entidad de dominio principal de una Historia Clínica
 */
export class MedicalRecord {
  private readonly id: string;
  private patientId: string;
  private entries: MedicalRecordEntry[];
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: string,
    patientId: string,
    entries: MedicalRecordEntry[] = []
  ) {
    this.id = id;
    this.patientId = patientId;
    this.entries = entries;
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

  public getEntries(): MedicalRecordEntry[] {
    return [...this.entries];
  }

  public getCreatedAt(): Date {
    return new Date(this.createdAt);
  }

  public getUpdatedAt(): Date {
    return new Date(this.updatedAt);
  }

  // Métodos de dominio
  public addEntry(entry: MedicalRecordEntry): void {
    this.entries.push(entry);
    this.markAsUpdated();
  }

  public getEntriesByType(type: RecordEntryType): MedicalRecordEntry[] {
    return this.entries.filter(entry => entry.getType() === type);
  }

  public getEntriesByDateRange(startDate: Date, endDate: Date): MedicalRecordEntry[] {
    return this.entries.filter(entry => {
      const entryDate = entry.getDate();
      return entryDate >= startDate && entryDate <= endDate;
    });
  }

  public getEntriesByDoctor(doctorId: string): MedicalRecordEntry[] {
    return this.entries.filter(entry => entry.getDoctorId() === doctorId);
  }

  public getLatestEntry(): MedicalRecordEntry | undefined {
    if (this.entries.length === 0) {
      return undefined;
    }
    
    return this.entries.sort((a, b) => 
      b.getDate().getTime() - a.getDate().getTime()
    )[0];
  }

  private markAsUpdated(): void {
    this.updatedAt = new Date();
  }
}

/**
 * Representa una entrada individual en la historia clínica
 */
export class MedicalRecordEntry {
  private readonly id: string;
  private type: RecordEntryType;
  private doctorId: string;
  private date: Date;
  private description: string;
  private diagnosis?: string;
  private prescriptions?: string[];
  private treatments?: string[];
  private attachments?: Attachment[];
  private vitalSigns?: VitalSigns;

  constructor(
    id: string,
    type: RecordEntryType,
    doctorId: string,
    date: Date,
    description: string,
    diagnosis?: string,
    prescriptions?: string[],
    treatments?: string[],
    attachments?: Attachment[],
    vitalSigns?: VitalSigns
  ) {
    this.id = id;
    this.type = type;
    this.doctorId = doctorId;
    this.date = date;
    this.description = description;
    this.diagnosis = diagnosis;
    this.prescriptions = prescriptions;
    this.treatments = treatments;
    this.attachments = attachments;
    this.vitalSigns = vitalSigns;
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getType(): RecordEntryType {
    return this.type;
  }

  public getDoctorId(): string {
    return this.doctorId;
  }

  public getDate(): Date {
    return new Date(this.date);
  }

  public getDescription(): string {
    return this.description;
  }

  public getDiagnosis(): string | undefined {
    return this.diagnosis;
  }

  public getPrescriptions(): string[] | undefined {
    return this.prescriptions ? [...this.prescriptions] : undefined;
  }

  public getTreatments(): string[] | undefined {
    return this.treatments ? [...this.treatments] : undefined;
  }

  public getAttachments(): Attachment[] | undefined {
    return this.attachments ? [...this.attachments] : undefined;
  }

  public getVitalSigns(): VitalSigns | undefined {
    return this.vitalSigns;
  }

  // Métodos de dominio
  public addAttachment(attachment: Attachment): void {
    if (!this.attachments) {
      this.attachments = [];
    }
    this.attachments.push(attachment);
  }

  public updateDiagnosis(diagnosis: string): void {
    this.diagnosis = diagnosis;
  }

  public addPrescription(prescriptionId: string): void {
    if (!this.prescriptions) {
      this.prescriptions = [];
    }
    this.prescriptions.push(prescriptionId);
  }

  public addTreatment(treatmentId: string): void {
    if (!this.treatments) {
      this.treatments = [];
    }
    this.treatments.push(treatmentId);
  }
}

/**
 * Tipo de entrada en la historia clínica
 */
export enum RecordEntryType {
  CONSULTATION = 'CONSULTATION',
  LAB_RESULT = 'LAB_RESULT',
  IMAGING = 'IMAGING',
  PROCEDURE = 'PROCEDURE',
  SURGERY = 'SURGERY',
  REFERRAL = 'REFERRAL',
  FOLLOW_UP = 'FOLLOW_UP'
}

/**
 * Representa un archivo adjunto en una entrada de historia clínica
 */
export class Attachment {
  constructor(
    private readonly id: string,
    private name: string,
    private type: string,
    private url: string,
    private size: number,
    private uploadDate: Date
  ) {}

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getType(): string {
    return this.type;
  }

  public getUrl(): string {
    return this.url;
  }

  public getSize(): number {
    return this.size;
  }

  public getUploadDate(): Date {
    return new Date(this.uploadDate);
  }
}

/**
 * Representa los signos vitales en una entrada de historia clínica
 */
export class VitalSigns {
  constructor(
    private temperature?: number,
    private bloodPressureSystolic?: number,
    private bloodPressureDiastolic?: number,
    private heartRate?: number,
    private respiratoryRate?: number,
    private oxygenSaturation?: number,
    private weight?: number,
    private height?: number
  ) {}

  public getTemperature(): number | undefined {
    return this.temperature;
  }

  public getBloodPressure(): { systolic: number, diastolic: number } | undefined {
    if (this.bloodPressureSystolic && this.bloodPressureDiastolic) {
      return {
        systolic: this.bloodPressureSystolic,
        diastolic: this.bloodPressureDiastolic
      };
    }
    return undefined;
  }

  public getHeartRate(): number | undefined {
    return this.heartRate;
  }

  public getRespiratoryRate(): number | undefined {
    return this.respiratoryRate;
  }

  public getOxygenSaturation(): number | undefined {
    return this.oxygenSaturation;
  }

  public getWeight(): number | undefined {
    return this.weight;
  }

  public getHeight(): number | undefined {
    return this.height;
  }

  public calculateBMI(): number | undefined {
    if (this.height && this.weight && this.height > 0) {
      const heightInMeters = this.height / 100;
      return this.weight / (heightInMeters * heightInMeters);
    }
    return undefined;
  }
} 