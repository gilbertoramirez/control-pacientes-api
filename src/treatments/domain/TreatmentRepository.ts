import { Treatment, TreatmentStatus, TreatmentType } from './Treatment';

/**
 * Filtros para la búsqueda de tratamientos
 */
export interface TreatmentFilters {
  patientId?: string;
  doctorId?: string;
  status?: TreatmentStatus;
  type?: TreatmentType;
  active?: boolean;
  startDateFrom?: Date;
  startDateTo?: Date;
  page?: number;
  limit?: number;
}

/**
 * Repositorio para la persistencia de tratamientos
 */
export interface TreatmentRepository {
  /**
   * Guarda un nuevo tratamiento
   */
  save(treatment: Treatment): Promise<void>;

  /**
   * Actualiza un tratamiento existente
   */
  update(treatment: Treatment): Promise<void>;

  /**
   * Busca un tratamiento por su ID
   */
  findById(id: string): Promise<Treatment | null>;

  /**
   * Busca tratamientos por los filtros especificados
   */
  findAll(filters?: TreatmentFilters): Promise<Treatment[]>;

  /**
   * Obtiene todos los tratamientos activos de un paciente
   */
  findActiveByPatientId(patientId: string): Promise<Treatment[]>;

  /**
   * Obtiene el número total de tratamientos según los filtros
   */
  count(filters?: TreatmentFilters): Promise<number>;
} 