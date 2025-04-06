import { Appointment, AppointmentStatus } from '../../domain/Appointment';

/**
 * Formato de cita para respuestas de API
 */
export interface AppointmentDTO {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  duration: number;
  reason: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Convierte un objeto de dominio Appointment a un DTO para la respuesta de API
 */
export function mapAppointmentToDTO(appointment: Appointment): AppointmentDTO {
  return {
    id: appointment.getId(),
    patientId: appointment.getPatientId(),
    doctorId: appointment.getDoctorId(),
    date: appointment.getDate().toISOString(),
    duration: appointment.getDuration(),
    reason: appointment.getReason(),
    status: appointment.getStatus(),
    notes: appointment.getNotes(),
    createdAt: appointment.getCreatedAt().toISOString(),
    updatedAt: appointment.getUpdatedAt().toISOString()
  };
} 