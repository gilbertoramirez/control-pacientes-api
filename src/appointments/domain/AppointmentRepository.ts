import { Appointment, AppointmentStatus } from './Appointment';

/**
 * Filtros para la búsqueda de citas
 */
export interface AppointmentFilters {
  patientId?: string;
  doctorId?: string;
  status?: AppointmentStatus;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

/**
 * Interfaz para el repositorio de Citas
 * Define las operaciones necesarias para persistir y recuperar citas
 */
export interface AppointmentRepository {
  /**
   * Guarda una nueva cita
   */
  save(appointment: Appointment): Promise<void>;

  /**
   * Actualiza una cita existente
   */
  update(appointment: Appointment): Promise<void>;

  /**
   * Busca una cita por su ID
   */
  findById(id: string): Promise<Appointment | null>;

  /**
   * Busca citas por los filtros especificados
   */
  findAll(filters?: AppointmentFilters): Promise<Appointment[]>;

  /**
   * Verifica la disponibilidad del doctor para la cita
   * @param doctorId ID del doctor
   * @param date Fecha y hora de la cita
   * @param duration Duración en minutos
   * @param excludeAppointmentId ID de cita a excluir (para actualización)
   */
  checkAvailability(doctorId: string, date: Date, duration: number, excludeAppointmentId?: string): Promise<boolean>;

  /**
   * Obtiene el número total de citas según los filtros
   */
  count(filters?: AppointmentFilters): Promise<number>;
} 