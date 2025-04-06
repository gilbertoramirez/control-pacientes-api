import { Patient } from '../domain/Patient';
import { PatientRepository } from '../domain/PatientRepository';
import { Result } from '../../core/domain/ValueObjects';

/**
 * DTO para la solicitud de obtención de paciente
 */
export interface GetPatientDTO {
  id: string;
}

/**
 * Caso de uso para obtener un paciente por su ID
 */
export class GetPatientUseCase {
  constructor(private readonly patientRepository: PatientRepository) {}

  /**
   * Ejecuta el caso de uso
   */
  public async execute(request: GetPatientDTO): Promise<Result<Patient | null>> {
    try {
      // Validar datos de entrada
      if (!request.id) {
        return Result.fail<Patient | null>('El ID del paciente es obligatorio');
      }

      // Buscar el paciente en el repositorio
      const patient = await this.patientRepository.findById(request.id);

      // Si no existe, devolvemos null pero como éxito (no es un error del sistema)
      if (!patient) {
        return Result.ok<Patient | null>(null);
      }

      return Result.ok<Patient | null>(patient);
    } catch (error) {
      console.error(`Error en GetPatientUseCase para ID ${request.id}:`, error);
      return Result.fail<Patient | null>(`Error al obtener paciente: ${error.message}`);
    }
  }
} 