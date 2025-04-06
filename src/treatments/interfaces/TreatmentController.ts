import { Request, Response } from 'express';
import {
  CreateTreatmentUseCase,
  GetTreatmentUseCase,
  ListTreatmentsUseCase,
  UpdateTreatmentUseCase,
  CompleteTreatmentUseCase,
  CancelTreatmentUseCase,
  ReactivateTreatmentUseCase
} from '../usecases';
import { mapTreatmentToDTO } from './mappers/TreatmentMapper';
import { TreatmentType } from '../domain/Treatment';

/**
 * Controlador para las operaciones relacionadas con tratamientos médicos
 * Actúa como un adaptador entre la API HTTP y los casos de uso del dominio
 */
export class TreatmentController {
  constructor(
    private readonly createTreatmentUseCase: CreateTreatmentUseCase,
    private readonly getTreatmentUseCase: GetTreatmentUseCase,
    private readonly listTreatmentsUseCase: ListTreatmentsUseCase,
    private readonly updateTreatmentUseCase: UpdateTreatmentUseCase,
    private readonly completeTreatmentUseCase: CompleteTreatmentUseCase,
    private readonly cancelTreatmentUseCase: CancelTreatmentUseCase,
    private readonly reactivateTreatmentUseCase: ReactivateTreatmentUseCase
  ) {}

  /**
   * Crea un nuevo tratamiento médico
   */
  async createTreatment(req: Request, res: Response): Promise<void> {
    try {
      const { 
        patientId, 
        doctorId, 
        name, 
        description, 
        type, 
        instructions, 
        startDate, 
        endDate, 
        notes 
      } = req.body;
      
      const result = await this.createTreatmentUseCase.execute({
        patientId,
        doctorId,
        name,
        description,
        type: type as TreatmentType,
        instructions,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
        notes
      });

      if (result.isSuccess()) {
        const treatmentDTO = mapTreatmentToDTO(result.getValue());
        res.status(201).json({ treatment: treatmentDTO });
      } else {
        res.status(400).json({ error: result.getError() });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  /**
   * Obtiene un tratamiento por su ID
   */
  async getTreatment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.getTreatmentUseCase.execute({ id });

      if (result.isSuccess()) {
        const treatment = result.getValue();
        if (treatment) {
          const treatmentDTO = mapTreatmentToDTO(treatment);
          res.status(200).json({ treatment: treatmentDTO });
        } else {
          res.status(404).json({ error: 'Tratamiento no encontrado' });
        }
      } else {
        res.status(400).json({ error: result.getError() });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  /**
   * Obtiene la lista de tratamientos con filtros opcionales
   */
  async listTreatments(req: Request, res: Response): Promise<void> {
    try {
      const { 
        patientId, 
        doctorId, 
        status, 
        type, 
        active, 
        startDateFrom, 
        startDateTo, 
        page, 
        limit 
      } = req.query;
      
      const result = await this.listTreatmentsUseCase.execute({
        patientId: patientId as string,
        doctorId: doctorId as string,
        status: status as any,
        type: type as any,
        active: active === 'true',
        startDateFrom: startDateFrom ? new Date(startDateFrom as string) : undefined,
        startDateTo: startDateTo ? new Date(startDateTo as string) : undefined,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined
      });

      if (result.isSuccess()) {
        const treatments = result.getValue();
        const treatmentDTOs = treatments.map(treatment => mapTreatmentToDTO(treatment));
        
        res.status(200).json({ 
          treatments: treatmentDTOs,
          count: treatmentDTOs.length,
          page: page ? parseInt(page as string, 10) : 1,
          limit: limit ? parseInt(limit as string, 10) : treatmentDTOs.length
        });
      } else {
        res.status(400).json({ error: result.getError() });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  /**
   * Actualiza un tratamiento existente
   */
  async updateTreatment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { 
        name, 
        description, 
        type, 
        instructions, 
        startDate, 
        endDate, 
        notes 
      } = req.body;

      const result = await this.updateTreatmentUseCase.execute({
        id,
        name,
        description,
        type: type as TreatmentType,
        instructions,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate === null ? null : (endDate ? new Date(endDate) : undefined),
        notes
      });

      if (result.isSuccess()) {
        const treatmentDTO = mapTreatmentToDTO(result.getValue());
        res.status(200).json({ treatment: treatmentDTO });
      } else {
        res.status(400).json({ error: result.getError() });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  /**
   * Completa un tratamiento
   */
  async completeTreatment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      
      const result = await this.completeTreatmentUseCase.execute({
        id,
        notes
      });

      if (result.isSuccess()) {
        const treatmentDTO = mapTreatmentToDTO(result.getValue());
        res.status(200).json({ treatment: treatmentDTO });
      } else {
        res.status(400).json({ error: result.getError() });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  /**
   * Cancela un tratamiento
   */
  async cancelTreatment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      
      const result = await this.cancelTreatmentUseCase.execute({
        id,
        reason
      });

      if (result.isSuccess()) {
        const treatmentDTO = mapTreatmentToDTO(result.getValue());
        res.status(200).json({ treatment: treatmentDTO });
      } else {
        res.status(400).json({ error: result.getError() });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  /**
   * Reactiva un tratamiento cancelado
   */
  async reactivateTreatment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      
      const result = await this.reactivateTreatmentUseCase.execute({
        id,
        notes
      });

      if (result.isSuccess()) {
        const treatmentDTO = mapTreatmentToDTO(result.getValue());
        res.status(200).json({ treatment: treatmentDTO });
      } else {
        res.status(400).json({ error: result.getError() });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
} 