import { Treatment, TreatmentType } from '../domain/Treatment';
import { TreatmentRepository } from '../domain/TreatmentRepository';
import { Result } from '../../core/domain/ValueObjects';

/**
 * DTO para la solicitud de actualización de tratamiento
 */
export interface UpdateTreatmentDTO {
  id: string;
  name?: string;
  description?: string;
  type?: TreatmentType;
  instructions?: string;
  startDate?: Date;
  endDate?: Date | null; // null para eliminar la fecha de fin
  notes?: string;
}

/**
 * Caso de uso para actualizar un tratamiento existente
 */
export class UpdateTreatmentUseCase {
  constructor(private readonly treatmentRepository: TreatmentRepository) {}

  /**
   * Ejecuta el caso de uso
   */
  public async execute(request: UpdateTreatmentDTO): Promise<Result<Treatment>> {
    try {
      // Validar ID del tratamiento
      if (!request.id) {
        return Result.fail<Treatment>('El ID del tratamiento es obligatorio');
      }

      // Buscar el tratamiento en el repositorio
      const existingTreatment = await this.treatmentRepository.findById(request.id);
      if (!existingTreatment) {
        return Result.fail<Treatment>(`Tratamiento con ID ${request.id} no encontrado`);
      }

      // Verificar si el tratamiento está completado o cancelado
      if (existingTreatment.isCompleted()) {
        return Result.fail<Treatment>('No se puede actualizar un tratamiento que ya ha sido completado');
      }

      if (existingTreatment.isCancelled()) {
        return Result.fail<Treatment>('No se puede actualizar un tratamiento que ha sido cancelado');
      }

      // Actualizar información si se proporciona
      if (request.name) {
        existingTreatment.updateName(request.name);
      }

      if (request.description) {
        existingTreatment.updateDescription(request.description);
      }

      if (request.type) {
        existingTreatment.updateType(request.type);
      }

      if (request.instructions) {
        existingTreatment.updateInstructions(request.instructions);
      }

      // Manejar fechas
      if (request.startDate || request.endDate !== undefined) {
        const newStartDate = request.startDate || existingTreatment.getStartDate();
        const newEndDate = request.endDate === null ? undefined : 
                          (request.endDate || existingTreatment.getEndDate());
        
        existingTreatment.updateDates(newStartDate, newEndDate);
      }

      // Actualizar notas si se proporcionan
      if (request.notes !== undefined) {
        existingTreatment.setNotes(request.notes);
      }

      // Guardar los cambios en el repositorio
      await this.treatmentRepository.update(existingTreatment);

      return Result.ok<Treatment>(existingTreatment);
    } catch (error) {
      console.error(`Error en UpdateTreatmentUseCase para ID ${request.id}:`, error);
      return Result.fail<Treatment>(`Error al actualizar tratamiento: ${error.message}`);
    }
  }
} 