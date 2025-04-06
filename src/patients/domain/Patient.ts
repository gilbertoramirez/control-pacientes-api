/**
 * Representa la entidad de dominio principal de un Paciente en el sistema
 */
export class Patient {
  private readonly id: string;
  private name: string;
  private lastName: string;
  private birthDate: Date;
  private gender: Gender;
  private contactInfo: ContactInfo;
  private medicalIdentifier: string;
  private bloodType?: BloodType;
  private allergies: string[];
  private createdAt: Date;
  private updatedAt: Date;
  private isActive: boolean;

  constructor(
    id: string,
    name: string,
    lastName: string,
    birthDate: Date,
    gender: Gender,
    contactInfo: ContactInfo,
    medicalIdentifier: string,
    bloodType?: BloodType,
    allergies: string[] = []
  ) {
    this.id = id;
    this.name = name;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.gender = gender;
    this.contactInfo = contactInfo;
    this.medicalIdentifier = medicalIdentifier;
    this.bloodType = bloodType;
    this.allergies = allergies;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.isActive = true;
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getLastName(): string {
    return this.lastName;
  }

  public getFullName(): string {
    return `${this.name} ${this.lastName}`;
  }

  public getBirthDate(): Date {
    return new Date(this.birthDate);
  }

  public getGender(): Gender {
    return this.gender;
  }

  public getAge(): number {
    const today = new Date();
    let age = today.getFullYear() - this.birthDate.getFullYear();
    const monthDiff = today.getMonth() - this.birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  public getContactInfo(): ContactInfo {
    return this.contactInfo;
  }

  public getMedicalIdentifier(): string {
    return this.medicalIdentifier;
  }

  public getBloodType(): BloodType | undefined {
    return this.bloodType;
  }

  public getAllergies(): string[] {
    return [...this.allergies];
  }

  public isActivePatient(): boolean {
    return this.isActive;
  }

  public getCreatedAt(): Date {
    return new Date(this.createdAt);
  }

  public getUpdatedAt(): Date {
    return new Date(this.updatedAt);
  }

  // Setters y métodos de dominio
  public updateContactInfo(contactInfo: ContactInfo): void {
    this.contactInfo = contactInfo;
    this.markAsUpdated();
  }

  public updateAllergies(allergies: string[]): void {
    this.allergies = allergies;
    this.markAsUpdated();
  }

  public setBloodType(bloodType: BloodType): void {
    this.bloodType = bloodType;
    this.markAsUpdated();
  }

  public deactivate(): void {
    this.isActive = false;
    this.markAsUpdated();
  }

  public activate(): void {
    this.isActive = true;
    this.markAsUpdated();
  }

  private markAsUpdated(): void {
    this.updatedAt = new Date();
  }
}

/**
 * Género del paciente
 */
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY'
}

/**
 * Tipo de sangre del paciente
 */
export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-'
}

/**
 * Información de contacto del paciente
 */
export class ContactInfo {
  constructor(
    private email: string,
    private phone: string,
    private address: string,
    private emergencyContact?: EmergencyContact
  ) {}

  public getEmail(): string {
    return this.email;
  }

  public getPhone(): string {
    return this.phone;
  }

  public getAddress(): string {
    return this.address;
  }

  public getEmergencyContact(): EmergencyContact | undefined {
    return this.emergencyContact;
  }

  public update(email: string, phone: string, address: string): void {
    this.email = email;
    this.phone = phone;
    this.address = address;
  }

  public setEmergencyContact(emergencyContact: EmergencyContact): void {
    this.emergencyContact = emergencyContact;
  }
}

/**
 * Contacto de emergencia del paciente
 */
export class EmergencyContact {
  constructor(
    private name: string,
    private phone: string,
    private relationship: string
  ) {}

  public getName(): string {
    return this.name;
  }

  public getPhone(): string {
    return this.phone;
  }

  public getRelationship(): string {
    return this.relationship;
  }
} 