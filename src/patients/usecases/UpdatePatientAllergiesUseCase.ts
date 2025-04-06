import { Patient } from '../domain/Patient';
import { PatientRepository } from '../domain/PatientRepository';
import { Result } from '../../core/domain/ValueObjects';

/**
 * DTO para la solicitud de actualización de alergias
 */
export interface UpdatePatientAllergiesDTO {
  id: string;
  allergies: string[];
  operation: 'SET' | 'ADD' | 'REMOVE'; // Tipo de operación a realizar
}

/**
 * Caso de uso para actualizar las alergias de un paciente
 */
export class UpdatePatientAllergiesUseCase {
  constructor(private readonly patientRepository: PatientRepository) {}

  /**
   * Ejecuta el caso de uso
   */
  public async execute(request: UpdatePatientAllergiesDTO): Promise<Result<Patient>> {
    try {
      // Validar ID del paciente
      if (!request.id) {
        return Result.fail<Patient>('El ID del paciente es obligatorio');
      }

      // Validar que se proporcionen alergias
      if (!request.allergies || !Array.isArray(request.allergies)) {
        return Result.fail<Patient>('Debe proporcionar una lista válida de alergias');
      }

      // Validar que se especifique una operación válida
      if (!request.operation || !['SET', 'ADD', 'REMOVE'].includes(request.operation)) {
        return Result.fail<Patient>('Debe especificar una operación válida: SET, ADD o REMOVE');
      }

      // Buscar el paciente por ID
      const patient = await this.patientRepository.findById(request.id);
      if (!patient) {
        return Result.fail<Patient>(`Paciente con ID ${request.id} no encontrado`);
      }

      // Obtener las alergias actuales
      const currentAllergies = patient.getAllergies();
      let updatedAllergies: string[] = [];

      // Actualizar las alergias según la operación
      switch (request.operation) {
        case 'SET':
          // Reemplazar todas las alergias
          updatedAllergies = [...request.allergies];
          break;

        case 'ADD':
          // Agregar nuevas alergias sin duplicar
          updatedAllergies = [
            ...currentAllergies,
            ...request.allergies.filter(allergy => !currentAllergies.includes(allergy))
          ];
          break;

        case 'REMOVE':
          // Eliminar las alergias especificadas
          updatedAllergies = currentAllergies.filter(
            allergy => !request.allergies.includes(allergy)
          );
          break;
      }

      // Actualizar las alergias del paciente
      patient.updateAllergies(updatedAllergies);

      // Guardar los cambios
      await this.patientRepository.update(patient);

      return Result.ok<Patient>(patient);
    } catch (error) {
      console.error(`Error en UpdatePatientAllergiesUseCase para ID ${request.id}:`, error);
      return Result.fail<Patient>(`Error al actualizar alergias: ${error.message}`);
    }
  }
} 