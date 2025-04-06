import { Treatment } from '../domain/Treatment';
import { TreatmentRepository } from '../domain/TreatmentRepository';
import { Result } from '../../core/domain/ValueObjects';

/**
 * DTO para la solicitud de completar un tratamiento
 */
export interface CompleteTreatmentDTO {
  id: string;
  notes?: string;
}

/**
 * Caso de uso para marcar un tratamiento como completado
 */
export class CompleteTreatmentUseCase {
  constructor(private readonly treatmentRepository: TreatmentRepository) {}

  /**
   * Ejecuta el caso de uso
   */
  public async execute(request: CompleteTreatmentDTO): Promise<Result<Treatment>> {
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

      // Verificar si ya está completado
      if (treatment.isCompleted()) {
        return Result.fail<Treatment>(`El tratamiento con ID ${request.id} ya está completado`);
      }

      // Verificar si está cancelado
      if (treatment.isCancelled()) {
        return Result.fail<Treatment>('No se puede completar un tratamiento que ha sido cancelado');
      }

      // Agregar notas si se proporcionan
      if (request.notes) {
        const currentNotes = treatment.getNotes() || '';
        const updatedNotes = `${currentNotes}\n[Notas de finalización: ${request.notes}]`.trim();
        treatment.setNotes(updatedNotes);
      }

      // Marcar como completado
      treatment.complete();

      // Guardar los cambios
      await this.treatmentRepository.update(treatment);

      return Result.ok<Treatment>(treatment);
    } catch (error) {
      console.error(`Error en CompleteTreatmentUseCase para ID ${request.id}:`, error);
      return Result.fail<Treatment>(`Error al completar tratamiento: ${error.message}`);
    }
  }
} 