import { Treatment } from '../domain/Treatment';
import { TreatmentRepository } from '../domain/TreatmentRepository';
import { Result } from '../../core/domain/ValueObjects';

/**
 * DTO para la solicitud de reactivación de un tratamiento
 */
export interface ReactivateTreatmentDTO {
  id: string;
  notes?: string;
}

/**
 * Caso de uso para reactivar un tratamiento previamente cancelado
 */
export class ReactivateTreatmentUseCase {
  constructor(private readonly treatmentRepository: TreatmentRepository) {}

  /**
   * Ejecuta el caso de uso
   */
  public async execute(request: ReactivateTreatmentDTO): Promise<Result<Treatment>> {
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

      // Verificar si el tratamiento está realmente cancelado
      if (!treatment.isCancelled()) {
        return Result.fail<Treatment>('Solo se pueden reactivar tratamientos que estén cancelados');
      }

      // Agregar notas de reactivación si se proporcionan
      if (request.notes) {
        const currentNotes = treatment.getNotes() || '';
        const updatedNotes = `${currentNotes}\n[Reactivado: ${request.notes}]`.trim();
        treatment.setNotes(updatedNotes);
      }

      // Reactivar el tratamiento
      treatment.reactivate();

      // Guardar los cambios
      await this.treatmentRepository.update(treatment);

      return Result.ok<Treatment>(treatment);
    } catch (error) {
      console.error(`Error en ReactivateTreatmentUseCase para ID ${request.id}:`, error);
      return Result.fail<Treatment>(`Error al reactivar tratamiento: ${error.message}`);
    }
  }
} 