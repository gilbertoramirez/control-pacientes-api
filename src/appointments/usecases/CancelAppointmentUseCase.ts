import { Appointment, AppointmentStatus } from '../domain/Appointment';
import { AppointmentRepository } from '../domain/AppointmentRepository';
import { Result } from '../../core/domain/ValueObjects';

/**
 * DTO para la solicitud de cancelación de cita
 */
export interface CancelAppointmentDTO {
  id: string;
  cancellationReason?: string;
}

/**
 * Caso de uso para cancelar una cita
 */
export class CancelAppointmentUseCase {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  /**
   * Ejecuta el caso de uso
   */
  public async execute(request: CancelAppointmentDTO): Promise<Result<Appointment>> {
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

      // Verificar si la cita ya está cancelada
      if (appointment.getStatus() === AppointmentStatus.CANCELLED) {
        return Result.fail<Appointment>(`La cita con ID ${request.id} ya está cancelada`);
      }

      // Verificar si la cita ya se completó
      if (appointment.getStatus() === AppointmentStatus.COMPLETED) {
        return Result.fail<Appointment>(`No se puede cancelar una cita que ya fue completada`);
      }

      // Actualizar notas con razón de cancelación si se proporciona
      if (request.cancellationReason) {
        const currentNotes = appointment.getNotes() || '';
        const updatedNotes = `${currentNotes}\n[Razón de cancelación: ${request.cancellationReason}]`.trim();
        appointment.setNotes(updatedNotes);
      }

      // Cambiar el estado a cancelado
      appointment.setStatus(AppointmentStatus.CANCELLED);

      // Guardar los cambios
      await this.appointmentRepository.update(appointment);

      return Result.ok<Appointment>(appointment);
    } catch (error) {
      console.error(`Error en CancelAppointmentUseCase para ID ${request.id}:`, error);
      return Result.fail<Appointment>(`Error al cancelar cita: ${error.message}`);
    }
  }
} 