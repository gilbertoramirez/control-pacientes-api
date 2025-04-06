/**
 * Representa la entidad de dominio principal de un Usuario del sistema
 */
export class User {
  private readonly id: string;
  private firstName: string;
  private lastName: string;
  private email: string;
  private password?: string; // Solo se almacena hash, no la contraseña real
  private role: UserRole;
  private specialization?: string; // Para médicos
  private licenseNumber?: string; // Número de licencia médica
  private contactPhone: string;
  private isActive: boolean;
  private lastLogin?: Date;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    role: UserRole,
    contactPhone: string,
    specialization?: string,
    licenseNumber?: string
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.role = role;
    this.contactPhone = contactPhone;
    this.specialization = specialization;
    this.licenseNumber = licenseNumber;
    this.isActive = true;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public getEmail(): string {
    return this.email;
  }

  public getRole(): UserRole {
    return this.role;
  }

  public getSpecialization(): string | undefined {
    return this.specialization;
  }

  public getLicenseNumber(): string | undefined {
    return this.licenseNumber;
  }

  public getContactPhone(): string {
    return this.contactPhone;
  }

  public isActiveUser(): boolean {
    return this.isActive;
  }

  public getLastLogin(): Date | undefined {
    return this.lastLogin ? new Date(this.lastLogin) : undefined;
  }

  // Métodos de dominio
  public updatePersonalInfo(firstName: string, lastName: string, contactPhone: string): void {
    this.firstName = firstName;
    this.lastName = lastName;
    this.contactPhone = contactPhone;
    this.markAsUpdated();
  }

  public updateProfessionalInfo(specialization: string, licenseNumber: string): void {
    this.specialization = specialization;
    this.licenseNumber = licenseNumber;
    this.markAsUpdated();
  }

  public setPassword(hashedPassword: string): void {
    this.password = hashedPassword;
    this.markAsUpdated();
  }

  public recordLogin(): void {
    this.lastLogin = new Date();
    this.markAsUpdated();
  }

  public changeEmail(newEmail: string): void {
    this.email = newEmail;
    this.markAsUpdated();
  }

  public activate(): void {
    this.isActive = true;
    this.markAsUpdated();
  }

  public deactivate(): void {
    this.isActive = false;
    this.markAsUpdated();
  }
  
  public promoteToRole(newRole: UserRole): void {
    // Podría incluir validaciones de reglas de negocio
    this.role = newRole;
    this.markAsUpdated();
  }

  private markAsUpdated(): void {
    this.updatedAt = new Date();
  }
  
  public isDoctor(): boolean {
    return this.role === UserRole.DOCTOR;
  }
  
  public isNurse(): boolean {
    return this.role === UserRole.NURSE;
  }
  
  public isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }
}

/**
 * Roles de usuario en el sistema
 */
export enum UserRole {
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
  ADMIN = 'ADMIN',
  LAB_TECHNICIAN = 'LAB_TECHNICIAN'
} 