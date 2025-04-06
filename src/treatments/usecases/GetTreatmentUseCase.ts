import { Treatment } from '../domain/Treatment';
import { TreatmentRepository } from '../domain/TreatmentRepository';
import { Result } from '../../core/domain/ValueObjects';

/**
 * DTO para la solicitud de obtención de tratamiento
 */
export interface GetTreatmentDTO {
  id: string;
}

/**
 * Caso de uso para obtener un tratamiento por su ID
 */
export class GetTreatmentUseCase {
  constructor(private readonly treatmentRepository: TreatmentRepository) {}

  /**
   * Ejecuta el caso de uso
   */
  public async execute(request: GetTreatmentDTO): Promise<Result<Treatment | null>> {
    try {
      // Validar ID del tratamiento
      if (!request.id) {
        return Result.fail<Treatment | null>('El ID del tratamiento es obligatorio');
      }

      // Obtener el tratamiento del repositorio
      const treatment = await this.treatmentRepository.findById(request.id);

      return Result.ok<Treatment | null>(treatment);
    } catch (error) {
      console.error(`Error en GetTreatmentUseCase para ID ${request.id}:`, error);
      return Result.fail<Treatment | null>(`Error al obtener tratamiento: ${error.message}`);
    }
  }
} 