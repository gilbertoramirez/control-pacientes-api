import { v4 as uuidv4 } from 'uuid';
import { Patient, Gender, BloodType, ContactInfo, EmergencyContact } from '../domain/Patient';
import { PatientRepository } from '../domain/PatientRepository';
import { Result } from '../../core/domain/ValueObjects';

/**
 * Interfaces para DTO de entrada del caso de uso
 */
export interface CreatePatientDTO {
  name: string;
  lastName: string;
  birthDate: Date;
  gender: Gender;
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
  bloodType?: BloodType;
  allergies?: string[];
}

/**
 * Caso de uso para crear un nuevo paciente
 */
export class CreatePatientUseCase {
  constructor(private readonly patientRepository: PatientRepository) {}

  /**
   * Ejecuta el caso de uso
   */
  public async execute(request: CreatePatientDTO): Promise<Result<Patient>> {
    try {
      // Validar datos de entrada
      if (!request.name || !request.lastName || !request.birthDate) {
        return Result.fail<Patient>('Nombre, apellido y fecha de nacimiento son obligatorios');
      }

      if (!request.contactInfo || !request.contactInfo.email || !request.contactInfo.phone) {
        return Result.fail<Patient>('Información de contacto es obligatoria');
      }

      if (!request.medicalIdentifier) {
        return Result.fail<Patient>('Identificador médico es obligatorio');
      }

      // Crear objeto ContactInfo
      const contactInfo = new ContactInfo(
        request.contactInfo.email,
        request.contactInfo.phone,
        request.contactInfo.address
      );

      // Agregar contacto de emergencia si se proporcionó
      if (request.contactInfo.emergencyContact) {
        const ec = request.contactInfo.emergencyContact;
        contactInfo.setEmergencyContact(
          new EmergencyContact(ec.name, ec.phone, ec.relationship)
        );
      }

      // Generar identificador único para el paciente
      const patientId = uuidv4();

      // Crear entidad de paciente
      const patient = new Patient(
        patientId,
        request.name,
        request.lastName,
        request.birthDate,
        request.gender,
        contactInfo,
        request.medicalIdentifier,
        request.bloodType,
        request.allergies || []
      );

      // Guardar en el repositorio
      await this.patientRepository.save(patient);

      return Result.ok<Patient>(patient);
    } catch (error) {
      console.error('Error en CreatePatientUseCase:', error);
      return Result.fail<Patient>(`Error al crear paciente: ${error.message}`);
    }
  }
} 