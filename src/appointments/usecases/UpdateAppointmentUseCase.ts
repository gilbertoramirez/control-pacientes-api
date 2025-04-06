import { Appointment, AppointmentStatus } from '../domain/Appointment';
import { AppointmentRepository } from '../domain/AppointmentRepository';
import { Result } from '../../core/domain/ValueObjects';

/**
 * DTO para la solicitud de actualización de cita
 */
export interface UpdateAppointmentDTO {
  id: string;
  date?: Date;
  duration?: number;
  reason?: string;
  status?: AppointmentStatus;
  notes?: string;
}

/**
 * Caso de uso para actualizar una cita existente
 */
export class UpdateAppointmentUseCase {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  /**
   * Ejecuta el caso de uso
   */
  public async execute(request: UpdateAppointmentDTO): Promise<Result<Appointment>> {
    try {
      // Validar ID de la cita
      if (!request.id) {
        return Result.fail<Appointment>('El ID de la cita es obligatorio');
      }

      // Buscar la cita en el repositorio
      const existingAppointment = await this.appointmentRepository.findById(request.id);
      if (!existingAppointment) {
        return Result.fail<Appointment>(`Cita con ID ${request.id} no encontrada`);
      }

      // Si se actualizará la fecha o duración, verificar disponibilidad
      if (request.date || request.duration) {
        const newDate = request.date || existingAppointment.getDate();
        const newDuration = request.duration || existingAppointment.getDuration();
        
        if (request.date || request.duration !== existingAppointment.getDuration()) {
          const isAvailable = await this.appointmentRepository.checkAvailability(
            existingAppointment.getDoctorId(),
            newDate,
            newDuration,
            request.id // Excluir la cita actual de la verificación
          );

          if (!isAvailable) {
            return Result.fail<Appointment>('El doctor no está disponible en el horario seleccionado');
          }
        }
      }

      // Actualizar información si se proporciona
      if (request.date) {
        existingAppointment.updateDate(request.date);
      }

      if (request.duration) {
        existingAppointment.updateDuration(request.duration);
      }

      if (request.reason) {
        existingAppointment.updateReason(request.reason);
      }

      if (request.status) {
        existingAppointment.updateStatus(request.status);
      }

      if (request.notes !== undefined) {
        existingAppointment.updateNotes(request.notes);
      }

      // Guardar los cambios en el repositorio
      await this.appointmentRepository.update(existingAppointment);

      return Result.ok<Appointment>(existingAppointment);
    } catch (error) {
      console.error(`Error en UpdateAppointmentUseCase para ID ${request.id}:`, error);
      return Result.fail<Appointment>(`Error al actualizar cita: ${error.message}`);
    }
  }
} 