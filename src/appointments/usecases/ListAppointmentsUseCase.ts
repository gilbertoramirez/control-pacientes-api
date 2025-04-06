import { Appointment, AppointmentStatus } from '../domain/Appointment';
import { AppointmentRepository } from '../domain/AppointmentRepository';
import { Result } from '../../core/domain/ValueObjects';

/**
 * DTO para la solicitud de listado de citas
 */
export interface ListAppointmentsDTO {
  patientId?: string;
  doctorId?: string;
  status?: AppointmentStatus;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

/**
 * Caso de uso para listar citas con filtros
 */
export class ListAppointmentsUseCase {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  /**
   * Ejecuta el caso de uso
   */
  public async execute(request: ListAppointmentsDTO): Promise<Result<Appointment[]>> {
    try {
      // Configurar paginación predeterminada
      const page = request.page || 1;
      const limit = request.limit || 10;

      // Obtener citas con los filtros aplicados
      const appointments = await this.appointmentRepository.findAll({
        patientId: request.patientId,
        doctorId: request.doctorId,
        status: request.status,
        dateFrom: request.dateFrom,
        dateTo: request.dateTo,
        page,
        limit
      });

      return Result.ok<Appointment[]>(appointments);
    } catch (error) {
      console.error('Error en ListAppointmentsUseCase:', error);
      return Result.fail<Appointment[]>(`Error al listar citas: ${error.message}`);
    }
  }
} 