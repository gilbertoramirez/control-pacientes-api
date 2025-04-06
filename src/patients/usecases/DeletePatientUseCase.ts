import { PatientRepository } from '../domain/PatientRepository';
import { Result } from '../../core/domain/ValueObjects';

/**
 * DTO para la solicitud de eliminación de paciente
 */
export interface DeletePatientDTO {
  id: string;
}

/**
 * Caso de uso para eliminar un paciente (soft delete)
 */
export class DeletePatientUseCase {
  constructor(private readonly patientRepository: PatientRepository) {}

  /**
   * Ejecuta el caso de uso
   */
  public async execute(request: DeletePatientDTO): Promise<Result<void>> {
    try {
      // Validar ID del paciente
      if (!request.id) {
        return Result.fail<void>('El ID del paciente es obligatorio');
      }

      // Verificar que el paciente existe
      const existingPatient = await this.patientRepository.findById(request.id);
      if (!existingPatient) {
        return Result.fail<void>(`Paciente con ID ${request.id} no encontrado`);
      }

      // Verificar si el paciente ya está desactivado
      if (!existingPatient.isActivePatient()) {
        return Result.fail<void>(`El paciente con ID ${request.id} ya está desactivado`);
      }

      // Realizar el soft delete
      await this.patientRepository.delete(request.id);

      return Result.ok<void>();
    } catch (error) {
      console.error(`Error en DeletePatientUseCase para ID ${request.id}:`, error);
      return Result.fail<void>(`Error al eliminar paciente: ${error.message}`);
    }
  }
} 