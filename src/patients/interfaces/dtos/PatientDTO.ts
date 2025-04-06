/**
 * DTO (Data Transfer Object) para la entidad de Paciente
 * Define la estructura de datos para comunicación con las interfaces externas (UI/API)
 */
export interface PatientDTO {
  id: string;
  fullName: string;
  age: number;
  birthDate: string; // ISO format
  gender: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  medicalIdentifier: string;
  bloodType?: string;
  allergies: string[];
  isActive: boolean;
  createdAt: string; // ISO format
  updatedAt: string; // ISO format
} 