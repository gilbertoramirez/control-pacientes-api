import { Treatment } from '../domain/Treatment';
import { TreatmentRepository } from '../domain/TreatmentRepository';
import { Result } from '../../core/domain/ValueObjects';

/**
 * DTO para la solicitud de cancelación de un tratamiento
 */
export interface CancelTreatmentDTO {
  id: string;
  reason?: string;
}

/**
 * Caso de uso para cancelar un tratamiento
 */
export class CancelTreatmentUseCase {
  constructor(private readonly treatmentRepository: TreatmentRepository) {}

  /**
   * Ejecuta el caso de uso
   */
  public async execute(request: CancelTreatmentDTO): Promise<Result<Treatment>> {
    try {
      // Validar ID del tratamiento
      if (!request.id) {
        return Result.fail<Treatment>('El ID del tratamiento es obligatorio');
      }

      // Buscar el tratamiento en el repositorio
      const treatment = await this.treatmentRepository.findById(request.id);
      if (!treatment) {
        return Result.fail<Treatment>(`Tratamiento con ID ${request.id} no encontrado`);
      }

      // Verificar si ya está cancelado
      if (treatment.isCancelled()) {
        return Result.fail<Treatment>(`El tratamiento con ID ${request.id} ya está cancelado`);
      }

      // Verificar si está completado
      if (treatment.isCompleted()) {
        return Result.fail<Treatment>('No se puede cancelar un tratamiento que ya ha sido completado');
      }

      // Cancelar el tratamiento
      treatment.cancel(request.reason);

      // Guardar los cambios
      await this.treatmentRepository.update(treatment);

      return Result.ok<Treatment>(treatment);
    } catch (error) {
      console.error(`Error en CancelTreatmentUseCase para ID ${request.id}:`, error);
      return Result.fail<Treatment>(`Error al cancelar tratamiento: ${error.message}`);
    }
  }
} 