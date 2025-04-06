import { Patient, Gender, BloodType, ContactInfo, EmergencyContact } from '../domain/Patient';
import { PatientRepository } from '../domain/PatientRepository';
import { Result } from '../../core/domain/ValueObjects';

/**
 * DTO para la solicitud de actualización de paciente
 */
export interface UpdatePatientDTO {
  id: string;
  name?: string;
  lastName?: string;
  birthDate?: Date;
  gender?: Gender;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    } | null; // null para eliminar el contacto de emergencia
  };
  medicalIdentifier?: string;
  bloodType?: BloodType | null; // null para eliminar el tipo de sangre
  allergies?: string[];
}

/**
 * Caso de uso para actualizar un paciente existente
 */
export class UpdatePatientUseCase {
  constructor(private readonly patientRepository: PatientRepository) {}

  /**
   * Ejecuta el caso de uso
   */
  public async execute(request: UpdatePatientDTO): Promise<Result<Patient>> {
    try {
      // Validar ID del paciente
      if (!request.id) {
        return Result.fail<Patient>('El ID del paciente es obligatorio');
      }

      // Buscar el paciente en el repositorio
      const existingPatient = await this.patientRepository.findById(request.id);
      if (!existingPatient) {
        return Result.fail<Patient>(`Paciente con ID ${request.id} no encontrado`);
      }

      // Actualizar información básica si se proporciona
      if (request.name) {
        existingPatient['name'] = request.name;
      }

      if (request.lastName) {
        existingPatient['lastName'] = request.lastName;
      }

      if (request.birthDate) {
        existingPatient['birthDate'] = request.birthDate;
      }

      if (request.gender) {
        existingPatient['gender'] = request.gender;
      }

      if (request.medicalIdentifier) {
        existingPatient['medicalIdentifier'] = request.medicalIdentifier;
      }

      // Actualizar tipo de sangre (puede ser null para eliminarlo)
      if (request.bloodType !== undefined) {
        if (request.bloodType === null) {
          existingPatient['bloodType'] = undefined;
        } else {
          existingPatient.setBloodType(request.bloodType);
        }
      }

      // Actualizar alergias
      if (request.allergies) {
        existingPatient.updateAllergies(request.allergies);
      }

      // Actualizar información de contacto
      if (request.contactInfo) {
        const currentContactInfo = existingPatient.getContactInfo();
        
        // Actualizar email, teléfono y dirección si se proporcionan
        currentContactInfo.update(
          request.contactInfo.email || currentContactInfo.getEmail(),
          request.contactInfo.phone || currentContactInfo.getPhone(),
          request.contactInfo.address || currentContactInfo.getAddress()
        );

        // Actualizar contacto de emergencia
        if (request.contactInfo.emergencyContact !== undefined) {
          if (request.contactInfo.emergencyContact === null) {
            // Eliminar contacto de emergencia
            currentContactInfo['emergencyContact'] = undefined;
          } else {
            // Actualizar o agregar contacto de emergencia
            const ec = request.contactInfo.emergencyContact;
            currentContactInfo.setEmergencyContact(
              new EmergencyContact(ec.name, ec.phone, ec.relationship)
            );
          }
        }

        // Actualizar la información de contacto en el paciente
        existingPatient.updateContactInfo(currentContactInfo);
      }

      // Guardar los cambios en el repositorio
      await this.patientRepository.update(existingPatient);

      return Result.ok<Patient>(existingPatient);
    } catch (error) {
      console.error(`Error en UpdatePatientUseCase para ID ${request.id}:`, error);
      return Result.fail<Patient>(`Error al actualizar paciente: ${error.message}`);
    }
  }
} 