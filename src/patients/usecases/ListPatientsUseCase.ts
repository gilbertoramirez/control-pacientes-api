import { Patient } from '../domain/Patient';
import { PatientRepository, PatientFilter } from '../domain/PatientRepository';
import { Result } from '../../core/domain/ValueObjects';

/**
 * DTO para la solicitud de listado de pacientes
 */
export interface ListPatientsDTO {
  name?: string;
  lastName?: string;
  medicalIdentifier?: string;
  email?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Caso de uso para listar pacientes con filtros opcionales
 */
export class ListPatientsUseCase {
  constructor(private readonly patientRepository: PatientRepository) {}

  /**
   * Ejecuta el caso de uso
   */
  public async execute(request: ListPatientsDTO): Promise<Result<Patient[]>> {
    try {
      // Preparar el filtro a partir del DTO
      const filter: PatientFilter = {};
      
      if (request.name) {
        filter.name = request.name;
      }
      
      if (request.lastName) {
        filter.lastName = request.lastName;
      }
      
      if (request.medicalIdentifier) {
        filter.medicalIdentifier = request.medicalIdentifier;
      }
      
      if (request.email) {
        filter.email = request.email;
      }
      
      if (request.isActive !== undefined) {
        filter.isActive = request.isActive;
      }

      // Buscar pacientes según filtro
      const patients = await this.patientRepository.findByFilter(filter);

      // Implementar paginación si se requiere
      let paginatedPatients = patients;
      
      if (request.page !== undefined && request.limit !== undefined) {
        const startIndex = (request.page - 1) * request.limit;
        const endIndex = request.page * request.limit;
        paginatedPatients = patients.slice(startIndex, endIndex);
      }

      return Result.ok<Patient[]>(paginatedPatients);
    } catch (error) {
      console.error('Error en ListPatientsUseCase:', error);
      return Result.fail<Patient[]>(`Error al listar pacientes: ${error.message}`);
    }
  }
} 