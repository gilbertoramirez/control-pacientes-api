import { Request, Response } from 'express';
import { 
  CreatePatientUseCase,
  GetPatientUseCase,
  ListPatientsUseCase,
  UpdatePatientUseCase,
  DeletePatientUseCase,
  ActivatePatientUseCase,
  UpdatePatientAllergiesUseCase,
  UpdatePatientContactInfoUseCase
} from '../usecases';
import { mapPatientToDTO } from './mappers/PatientMapper';

/**
 * Controlador para las operaciones relacionadas con pacientes
 * Actúa como un adaptador entre la API HTTP y los casos de uso del dominio
 */
export class PatientController {
  constructor(
    private readonly createPatientUseCase: CreatePatientUseCase,
    private readonly getPatientUseCase: GetPatientUseCase,
    private readonly listPatientsUseCase: ListPatientsUseCase,
    private readonly updatePatientUseCase: UpdatePatientUseCase,
    private readonly deletePatientUseCase: DeletePatientUseCase,
    private readonly activatePatientUseCase: ActivatePatientUseCase,
    private readonly updatePatientAllergiesUseCase: UpdatePatientAllergiesUseCase,
    private readonly updatePatientContactInfoUseCase: UpdatePatientContactInfoUseCase
  ) {}

  /**
   * Crea un nuevo paciente
   */
  async createPatient(req: Request, res: Response): Promise<void> {
    try {
      const { name, lastName, birthDate, gender, email, phone, address, medicalIdentifier, bloodType, allergies, emergencyContact } = req.body;
      
      const result = await this.createPatientUseCase.execute({
        name,
        lastName,
        birthDate: new Date(birthDate),
        gender,
        contactInfo: {
          email,
          phone,
          address,
          emergencyContact
        },
        medicalIdentifier,
        bloodType,
        allergies
      });

      if (result.isSuccess()) {
        const patientDTO = mapPatientToDTO(result.getValue());
        res.status(201).json({ patient: patientDTO });
      } else {
        res.status(400).json({ error: result.getError() });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  /**
   * Obtiene un paciente por su ID
   */
  async getPatient(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.getPatientUseCase.execute({ id });

      if (result.isSuccess()) {
        const patient = result.getValue();
        if (patient) {
          const patientDTO = mapPatientToDTO(patient);
          res.status(200).json({ patient: patientDTO });
        } else {
          res.status(404).json({ error: 'Paciente no encontrado' });
        }
      } else {
        res.status(400).json({ error: result.getError() });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  /**
   * Obtiene la lista de pacientes con filtros opcionales
   */
  async listPatients(req: Request, res: Response): Promise<void> {
    try {
      const { name, lastName, medicalIdentifier, email, isActive, page, limit } = req.query;
      
      const result = await this.listPatientsUseCase.execute({
        name: name as string,
        lastName: lastName as string,
        medicalIdentifier: medicalIdentifier as string,
        email: email as string,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined
      });

      if (result.isSuccess()) {
        const patients = result.getValue();
        const patientDTOs = patients.map(patient => mapPatientToDTO(patient));
        
        res.status(200).json({ 
          patients: patientDTOs,
          count: patientDTOs.length,
          page: page ? parseInt(page as string, 10) : 1,
          limit: limit ? parseInt(limit as string, 10) : patientDTOs.length
        });
      } else {
        res.status(400).json({ error: result.getError() });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  /**
   * Actualiza un paciente existente
   */
  async updatePatient(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, lastName, birthDate, gender, contactInfo, medicalIdentifier, bloodType, allergies } = req.body;

      const result = await this.updatePatientUseCase.execute({
        id,
        name,
        lastName,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        gender,
        contactInfo,
        medicalIdentifier,
        bloodType,
        allergies
      });

      if (result.isSuccess()) {
        const patientDTO = mapPatientToDTO(result.getValue());
        res.status(200).json({ patient: patientDTO });
      } else {
        res.status(400).json({ error: result.getError() });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  /**
   * Elimina un paciente (soft delete)
   */
  async deletePatient(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const result = await this.deletePatientUseCase.execute({ id });

      if (result.isSuccess()) {
        res.status(204).send();
      } else {
        res.status(400).json({ error: result.getError() });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  /**
   * Reactiva un paciente previamente desactivado
   */
  async activatePatient(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const result = await this.activatePatientUseCase.execute({ id });

      if (result.isSuccess()) {
        const patientDTO = mapPatientToDTO(result.getValue());
        res.status(200).json({ patient: patientDTO });
      } else {
        res.status(400).json({ error: result.getError() });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  /**
   * Actualiza las alergias de un paciente
   */
  async updateAllergies(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { allergies, operation } = req.body;
      
      if (!operation || !['SET', 'ADD', 'REMOVE'].includes(operation)) {
        res.status(400).json({ error: 'Debe especificar una operación válida: SET, ADD o REMOVE' });
        return;
      }

      const result = await this.updatePatientAllergiesUseCase.execute({
        id,
        allergies,
        operation
      });

      if (result.isSuccess()) {
        const patientDTO = mapPatientToDTO(result.getValue());
        res.status(200).json({ patient: patientDTO });
      } else {
        res.status(400).json({ error: result.getError() });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  /**
   * Actualiza la información de contacto de un paciente
   */
  async updateContactInfo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { email, phone, address, emergencyContact } = req.body;
      
      const result = await this.updatePatientContactInfoUseCase.execute({
        id,
        email,
        phone,
        address,
        emergencyContact
      });

      if (result.isSuccess()) {
        const patientDTO = mapPatientToDTO(result.getValue());
        res.status(200).json({ patient: patientDTO });
      } else {
        res.status(400).json({ error: result.getError() });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
} 