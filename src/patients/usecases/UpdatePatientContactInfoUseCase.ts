import { Patient, ContactInfo, EmergencyContact } from '../domain/Patient';
import { PatientRepository } from '../domain/PatientRepository';
import { Result } from '../../core/domain/ValueObjects';

/**
 * DTO para la solicitud de actualización de información de contacto
 */
export interface UpdatePatientContactInfoDTO {
  id: string;
  email?: string;
  phone?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  } | null; // null para eliminar el contacto de emergencia
}

/**
 * Caso de uso para actualizar la información de contacto de un paciente
 */
export class UpdatePatientContactInfoUseCase {
  constructor(private readonly patientRepository: PatientRepository) {}

  /**
   * Ejecuta el caso de uso
   */
  public async execute(request: UpdatePatientContactInfoDTO): Promise<Result<Patient>> {
    try {
      // Validar ID del paciente
      if (!request.id) {
        return Result.fail<Patient>('El ID del paciente es obligatorio');
      }

      // Validar que se proporcione al menos un campo para actualizar
      if (!request.email && !request.phone && !request.address && request.emergencyContact === undefined) {
        return Result.fail<Patient>('Debe proporcionar al menos un campo de contacto para actualizar');
      }

      // Buscar el paciente por ID
      const patient = await this.patientRepository.findById(request.id);
      if (!patient) {
        return Result.fail<Patient>(`Paciente con ID ${request.id} no encontrado`);
      }

      // Obtener la información de contacto actual
      const currentContactInfo = patient.getContactInfo();

      // Actualizar email, teléfono y dirección si se proporcionan
      const newEmail = request.email !== undefined ? request.email : currentContactInfo.getEmail();
      const newPhone = request.phone !== undefined ? request.phone : currentContactInfo.getPhone();
      const newAddress = request.address !== undefined ? request.address : currentContactInfo.getAddress();

      // Crear nueva instancia de ContactInfo con los valores actualizados
      const updatedContactInfo = new ContactInfo(
        newEmail,
        newPhone,
        newAddress
      );

      // Manejar contacto de emergencia
      if (request.emergencyContact !== undefined) {
        if (request.emergencyContact === null) {
          // No hacer nada, ya que la nueva instancia no tiene contacto de emergencia por defecto
        } else {
          // Actualizar o agregar contacto de emergencia
          const ec = request.emergencyContact;
          updatedContactInfo.setEmergencyContact(
            new EmergencyContact(ec.name, ec.phone, ec.relationship)
          );
        }
      } else {
        // Mantener el contacto de emergencia actual si existe
        const currentEmergencyContact = currentContactInfo.getEmergencyContact();
        if (currentEmergencyContact) {
          updatedContactInfo.setEmergencyContact(currentEmergencyContact);
        }
      }

      // Actualizar la información de contacto en el paciente
      patient.updateContactInfo(updatedContactInfo);

      // Guardar los cambios
      await this.patientRepository.update(patient);

      return Result.ok<Patient>(patient);
    } catch (error) {
      console.error(`Error en UpdatePatientContactInfoUseCase para ID ${request.id}:`, error);
      return Result.fail<Patient>(`Error al actualizar información de contacto: ${error.message}`);
    }
  }
} 