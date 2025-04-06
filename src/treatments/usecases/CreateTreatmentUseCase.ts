import { v4 as uuidv4 } from 'uuid';
import { Treatment, TreatmentStatus, TreatmentType } from '../domain/Treatment';
import { TreatmentRepository } from '../domain/TreatmentRepository';
import { Result } from '../../core/domain/ValueObjects';

/**
 * DTO para la solicitud de creación de tratamiento
 */
export interface CreateTreatmentDTO {
  patientId: string;
  doctorId: string;
  name: string;
  description: string;
  type: TreatmentType;
  instructions: string;
  startDate: Date;
  endDate?: Date;
  status?: TreatmentStatus;
  notes?: string;
}

/**
 * Caso de uso para crear un nuevo tratamiento
 */
export class CreateTreatmentUseCase {
  constructor(private readonly treatmentRepository: TreatmentRepository) {}

  /**
   * Ejecuta el caso de uso
   */
  public async execute(request: CreateTreatmentDTO): Promise<Result<Treatment>> {
    try {
      // Validar datos de entrada
      if (!request.patientId) {
        return Result.fail<Treatment>('El ID del paciente es obligatorio');
      }

      if (!request.doctorId) {
        return Result.fail<Treatment>('El ID del doctor es obligatorio');
      }

      if (!request.name || request.name.trim() === '') {
        return Result.fail<Treatment>('El nombre del tratamiento es obligatorio');
      }

      if (!request.description || request.description.trim() === '') {
        return Result.fail<Treatment>('La descripción del tratamiento es obligatoria');
      }

      if (!request.type) {
        return Result.fail<Treatment>('El tipo de tratamiento es obligatorio');
      }

      if (!request.instructions || request.instructions.trim() === '') {
        return Result.fail<Treatment>('Las instrucciones del tratamiento son obligatorias');
      }

      if (!request.startDate) {
        return Result.fail<Treatment>('La fecha de inicio del tratamiento es obligatoria');
      }

      // Generar ID único para el tratamiento
      const treatmentId = uuidv4();

      // Crear entidad de tratamiento
      const treatment = new Treatment(
        treatmentId,
        request.patientId,
        request.doctorId,
        request.name,
        request.description,
        request.type,
        request.instructions,
        request.startDate,
        request.endDate,
        request.status || TreatmentStatus.ACTIVE,
        request.notes
      );

      // Guardar en el repositorio
      await this.treatmentRepository.save(treatment);

      return Result.ok<Treatment>(treatment);
    } catch (error) {
      console.error('Error en CreateTreatmentUseCase:', error);
      return Result.fail<Treatment>(`Error al crear tratamiento: ${error.message}`);
    }
  }
} 