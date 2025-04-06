import { Patient, Gender, BloodType, ContactInfo, EmergencyContact } from '../../domain/Patient';
import { PatientDTO } from '../dtos/PatientDTO';

/**
 * Convierte una entidad de dominio Patient a un PatientDTO para la capa de interfaces
 */
export function mapPatientToDTO(patient: Patient): PatientDTO {
  const contactInfo = patient.getContactInfo();
  const emergencyContact = contactInfo.getEmergencyContact();
  
  return {
    id: patient.getId(),
    fullName: patient.getFullName(),
    age: patient.getAge(),
    birthDate: new Date().toISOString(),
    gender: 'UNKNOWN',
    contactInfo: {
      email: contactInfo.getEmail(),
      phone: contactInfo.getPhone(),
      address: contactInfo.getAddress(),
      emergencyContact: emergencyContact ? {
        name: emergencyContact.getName(),
        phone: emergencyContact.getPhone(),
        relationship: emergencyContact.getRelationship()
      } : undefined
    },
    medicalIdentifier: patient.getMedicalIdentifier(),
    bloodType: patient.getBloodType(),
    allergies: patient.getAllergies(),
    isActive: patient.isActivePatient(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Convierte un PatientDTO de la capa de interfaces a una entidad de dominio Patient
 * (Función parcial - normalmente se usaría para crear un Patient a partir de datos externos)
 */
export function mapDTOToPatient(dto: Partial<PatientDTO>, id: string): Patient {
  // Crear ContactInfo
  const contactInfo = new ContactInfo(
    dto.contactInfo?.email || '',
    dto.contactInfo?.phone || '',
    dto.contactInfo?.address || ''
  );
  
  // Agregar EmergencyContact si existe
  if (dto.contactInfo?.emergencyContact) {
    const emergency = dto.contactInfo.emergencyContact;
    contactInfo.setEmergencyContact(
      new EmergencyContact(
        emergency.name,
        emergency.phone,
        emergency.relationship
      )
    );
  }
  
  // Crear Patient
  const patient = new Patient(
    id,
    dto.fullName?.split(' ')[0] || '',
    dto.fullName?.split(' ').slice(1).join(' ') || '',
    dto.birthDate ? new Date(dto.birthDate) : new Date(),
    dto.gender as Gender || Gender.PREFER_NOT_TO_SAY,
    contactInfo,
    dto.medicalIdentifier || '',
    dto.bloodType as BloodType,
    dto.allergies || []
  );
  
  // Retornar Patient
  return patient;
} 