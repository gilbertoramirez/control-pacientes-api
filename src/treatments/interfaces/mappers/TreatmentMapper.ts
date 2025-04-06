import { Treatment, TreatmentStatus, TreatmentType } from '../../domain/Treatment';

/**
 * Formato de tratamiento para respuestas de API
 */
export interface TreatmentDTO {
  id: string;
  patientId: string;
  doctorId: string;
  name: string;
  description: string;
  type: TreatmentType;
  status: TreatmentStatus;
  instructions: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Convierte un objeto de dominio Treatment a un DTO para la respuesta de API
 */
export function mapTreatmentToDTO(treatment: Treatment): TreatmentDTO {
  return {
    id: treatment.getId(),
    patientId: treatment.getPatientId(),
    doctorId: treatment.getDoctorId(),
    name: treatment.getName(),
    description: treatment.getDescription(),
    type: treatment.getType(),
    status: treatment.getStatus(),
    instructions: treatment.getInstructions(),
    startDate: treatment.getStartDate().toISOString(),
    endDate: treatment.getEndDate()?.toISOString(),
    notes: treatment.getNotes(),
    createdAt: treatment.getCreatedAt().toISOString(),
    updatedAt: treatment.getUpdatedAt().toISOString()
  };
} 