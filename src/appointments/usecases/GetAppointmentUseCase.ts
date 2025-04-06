import { Appointment } from '../domain/Appointment';
import { AppointmentRepository } from '../domain/AppointmentRepository';
import { Result } from '../../core/domain/ValueObjects';

/**
 * DTO para la solicitud de obtención de cita
 */
export interface GetAppointmentDTO {
  id: string;
}

/**
 * Caso de uso para obtener una cita por su ID
 */
export class GetAppointmentUseCase {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  /**
   * Ejecuta el caso de uso
   */
  public async execute(request: GetAppointmentDTO): Promise<Result<Appointment | null>> {
    try {
      // Validar ID de la cita
      if (!request.id) {
        return Result.fail<Appointment | null>('El ID de la cita es obligatorio');
      }

      // Obtener la cita del repositorio
      const appointment = await this.appointmentRepository.findById(request.id);

      return Result.ok<Appointment | null>(appointment);
    } catch (error) {
      console.error(`Error en GetAppointmentUseCase para ID ${request.id}:`, error);
      return Result.fail<Appointment | null>(`Error al obtener cita: ${error.message}`);
    }
  }
} 