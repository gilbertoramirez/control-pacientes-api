import { Appointment, AppointmentStatus } from '../domain/Appointment';
import { AppointmentRepository } from '../domain/AppointmentRepository';
import { Result } from '../../core/domain/ValueObjects';

/**
 * DTO para la solicitud de completar una cita
 */
export interface CompleteAppointmentDTO {
  id: string;
  notes?: string;
}

/**
 * Caso de uso para marcar una cita como completada
 */
export class CompleteAppointmentUseCase {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  /**
   * Ejecuta el caso de uso
   */
  public async execute(request: CompleteAppointmentDTO): Promise<Result<Appointment>> {
    try {
      // Validar ID de la cita
      if (!request.id) {
        return Result.fail<Appointment>('El ID de la cita es obligatorio');
      }

      // Buscar la cita en el repositorio
      const appointment = await this.appointmentRepository.findById(request.id);
      if (!appointment) {
        return Result.fail<Appointment>(`Cita con ID ${request.id} no encontrada`);
      }

      // Verificar si la cita ya está completada
      if (appointment.getStatus() === AppointmentStatus.COMPLETED) {
        return Result.fail<Appointment>(`La cita con ID ${request.id} ya está marcada como completada`);
      }

      // Verificar si la cita está cancelada
      if (appointment.getStatus() === AppointmentStatus.CANCELLED) {
        return Result.fail<Appointment>(`No se puede completar una cita que ha sido cancelada`);
      }

      // Agregar notas si se proporcionan
      if (request.notes) {
        const currentNotes = appointment.getNotes() || '';
        const updatedNotes = `${currentNotes}\n[Notas de finalización: ${request.notes}]`.trim();
        appointment.setNotes(updatedNotes);
      }

      // Cambiar el estado a completado
      appointment.setStatus(AppointmentStatus.COMPLETED);

      // Guardar los cambios
      await this.appointmentRepository.update(appointment);

      return Result.ok<Appointment>(appointment);
    } catch (error) {
      console.error(`Error en CompleteAppointmentUseCase para ID ${request.id}:`, error);
      return Result.fail<Appointment>(`Error al completar cita: ${error.message}`);
    }
  }
} 