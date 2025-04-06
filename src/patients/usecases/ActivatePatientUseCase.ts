import { Patient } from '../domain/Patient';
import { PatientRepository } from '../domain/PatientRepository';
import { Result } from '../../core/domain/ValueObjects';

/**
 * DTO para la solicitud de activación de paciente
 */
export interface ActivatePatientDTO {
  id: string;
}

/**
 * Caso de uso para activar un paciente previamente desactivado
 */
export class ActivatePatientUseCase {
  constructor(private readonly patientRepository: PatientRepository) {}

  /**
   * Ejecuta el caso de uso
   */
  public async execute(request: ActivatePatientDTO): Promise<Result<Patient>> {
    try {
      // Validar ID del paciente
      if (!request.id) {
        return Result.fail<Patient>('El ID del paciente es obligatorio');
      }

      // Verificar que el paciente existe
      const existingPatient = await this.patientRepository.findById(request.id);
      if (!existingPatient) {
        return Result.fail<Patient>(`Paciente con ID ${request.id} no encontrado`);
      }

      // Verificar si el paciente ya está activo
      if (existingPatient.isActivePatient()) {
        return Result.fail<Patient>(`El paciente con ID ${request.id} ya está activo`);
      }

      // Activar el paciente
      existingPatient.activate();

      // Guardar los cambios
      await this.patientRepository.update(existingPatient);

      return Result.ok<Patient>(existingPatient);
    } catch (error) {
      console.error(`Error en ActivatePatientUseCase para ID ${request.id}:`, error);
      return Result.fail<Patient>(`Error al activar paciente: ${error.message}`);
    }
  }
} 