import { Treatment, TreatmentStatus, TreatmentType } from '../domain/Treatment';
import { TreatmentRepository, TreatmentFilters } from '../domain/TreatmentRepository';
import { Result } from '../../core/domain/ValueObjects';

/**
 * DTO para la solicitud de listado de tratamientos
 */
export interface ListTreatmentsDTO {
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
 * Caso de uso para listar tratamientos con filtros
 */
export class ListTreatmentsUseCase {
  constructor(private readonly treatmentRepository: TreatmentRepository) {}

  /**
   * Ejecuta el caso de uso
   */
  public async execute(request: ListTreatmentsDTO): Promise<Result<Treatment[]>> {
    try {
      // Configurar filtros
      const filters: TreatmentFilters = {
        patientId: request.patientId,
        doctorId: request.doctorId,
        status: request.status,
        type: request.type,
        active: request.active,
        startDateFrom: request.startDateFrom,
        startDateTo: request.startDateTo,
        page: request.page || 1,
        limit: request.limit || 10
      };

      // Obtener tratamientos con los filtros aplicados
      const treatments = await this.treatmentRepository.findAll(filters);

      return Result.ok<Treatment[]>(treatments);
    } catch (error) {
      console.error('Error en ListTreatmentsUseCase:', error);
      return Result.fail<Treatment[]>(`Error al listar tratamientos: ${error.message}`);
    }
  }
} 