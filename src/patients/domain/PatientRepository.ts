import { Patient } from './Patient';

/**
 * Interfaz para el repositorio de Pacientes
 * Define las operaciones necesarias para persistir y recuperar pacientes
 * siguiendo el patrón de Repository
 */
export interface PatientRepository {
  /**
   * Busca un paciente por su identificador único
   */
  findById(id: string): Promise<Patient | null>;

  /**
   * Busca pacientes que coincidan con los criterios de búsqueda
   */
  findByFilter(filter: PatientFilter): Promise<Patient[]>;

  /**
   * Guarda un nuevo paciente
   */
  save(patient: Patient): Promise<void>;

  /**
   * Actualiza un paciente existente
   */
  update(patient: Patient): Promise<void>;

  /**
   * Elimina un paciente por su identificador único (soft delete)
   */
  delete(id: string): Promise<void>;
}

/**
 * Filtro para buscar pacientes
 */
export interface PatientFilter {
  name?: string;
  lastName?: string;
  medicalIdentifier?: string;
  email?: string;
  isActive?: boolean;
} 