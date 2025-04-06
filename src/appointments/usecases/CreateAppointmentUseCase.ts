import { v4 as uuidv4 } from 'uuid';
import { Appointment, AppointmentStatus } from '../domain/Appointment';
import { AppointmentRepository } from '../domain/AppointmentRepository';
import { Result } from '../../core/domain/ValueObjects';

/**
 * DTO para la solicitud de creación de cita
 */
export interface CreateAppointmentDTO {
  patientId: string;
  doctorId: string;
  date: Date;
  duration: number; // duración en minutos
  reason: string;
  status?: AppointmentStatus;
  notes?: string;
}

/**
 * Caso de uso para crear una nueva cita
 */
export class CreateAppointmentUseCase {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  /**
   * Ejecuta el caso de uso
   */
  public async execute(request: CreateAppointmentDTO): Promise<Result<Appointment>> {
    try {
      // Validar datos de entrada
      if (!request.patientId) {
        return Result.fail<Appointment>('El ID del paciente es obligatorio');
      }

      if (!request.doctorId) {
        return Result.fail<Appointment>('El ID del doctor es obligatorio');
      }

      if (!request.date) {
        return Result.fail<Appointment>('La fecha de la cita es obligatoria');
      }

      if (!request.duration || request.duration <= 0) {
        return Result.fail<Appointment>('La duración de la cita debe ser mayor a cero');
      }

      if (!request.reason) {
        return Result.fail<Appointment>('El motivo de la cita es obligatorio');
      }

      // Verificar disponibilidad
      const isAvailable = await this.appointmentRepository.checkAvailability(
        request.doctorId, 
        request.date, 
        request.duration
      );

      if (!isAvailable) {
        return Result.fail<Appointment>('El doctor no está disponible en el horario seleccionado');
      }

      // Generar ID único para la cita
      const appointmentId = uuidv4();

      // Crear entidad de cita
      const appointment = new Appointment(
        appointmentId,
        request.patientId,
        request.doctorId,
        request.date,
        request.duration,
        request.reason,
        request.status || AppointmentStatus.SCHEDULED,
        request.notes
      );

      // Guardar en el repositorio
      await this.appointmentRepository.save(appointment);

      return Result.ok<Appointment>(appointment);
    } catch (error) {
      console.error('Error en CreateAppointmentUseCase:', error);
      return Result.fail<Appointment>(`Error al crear cita: ${error.message}`);
    }
  }
} 