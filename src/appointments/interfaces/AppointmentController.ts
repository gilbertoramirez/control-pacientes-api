import { Request, Response } from 'express';
import { 
  CreateAppointmentUseCase,
  GetAppointmentUseCase,
  ListAppointmentsUseCase,
  UpdateAppointmentUseCase,
  CancelAppointmentUseCase,
  CompleteAppointmentUseCase
} from '../usecases';
import { mapAppointmentToDTO } from './mappers/AppointmentMapper';

/**
 * Controlador para las operaciones relacionadas con citas médicas
 * Actúa como un adaptador entre la API HTTP y los casos de uso del dominio
 */
export class AppointmentController {
  constructor(
    private readonly createAppointmentUseCase: CreateAppointmentUseCase,
    private readonly getAppointmentUseCase: GetAppointmentUseCase,
    private readonly listAppointmentsUseCase: ListAppointmentsUseCase,
    private readonly updateAppointmentUseCase: UpdateAppointmentUseCase,
    private readonly cancelAppointmentUseCase: CancelAppointmentUseCase,
    private readonly completeAppointmentUseCase: CompleteAppointmentUseCase
  ) {}

  /**
   * Crea una nueva cita médica
   */
  async createAppointment(req: Request, res: Response): Promise<void> {
    try {
      const { patientId, doctorId, date, duration, reason, notes } = req.body;
      
      const result = await this.createAppointmentUseCase.execute({
        patientId,
        doctorId,
        date: new Date(date),
        duration,
        reason,
        notes
      });

      if (result.isSuccess()) {
        const appointmentDTO = mapAppointmentToDTO(result.getValue());
        res.status(201).json({ appointment: appointmentDTO });
      } else {
        res.status(400).json({ error: result.getError() });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  /**
   * Obtiene una cita por su ID
   */
  async getAppointment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.getAppointmentUseCase.execute({ id });

      if (result.isSuccess()) {
        const appointment = result.getValue();
        if (appointment) {
          const appointmentDTO = mapAppointmentToDTO(appointment);
          res.status(200).json({ appointment: appointmentDTO });
        } else {
          res.status(404).json({ error: 'Cita no encontrada' });
        }
      } else {
        res.status(400).json({ error: result.getError() });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  /**
   * Obtiene la lista de citas con filtros opcionales
   */
  async listAppointments(req: Request, res: Response): Promise<void> {
    try {
      const { patientId, doctorId, status, dateFrom, dateTo, page, limit } = req.query;
      
      const result = await this.listAppointmentsUseCase.execute({
        patientId: patientId as string,
        doctorId: doctorId as string,
        status: status as any,
        dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
        dateTo: dateTo ? new Date(dateTo as string) : undefined,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined
      });

      if (result.isSuccess()) {
        const appointments = result.getValue();
        const appointmentDTOs = appointments.map(appointment => mapAppointmentToDTO(appointment));
        
        res.status(200).json({ 
          appointments: appointmentDTOs,
          count: appointmentDTOs.length,
          page: page ? parseInt(page as string, 10) : 1,
          limit: limit ? parseInt(limit as string, 10) : appointmentDTOs.length
        });
      } else {
        res.status(400).json({ error: result.getError() });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  /**
   * Actualiza una cita existente
   */
  async updateAppointment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { date, duration, reason, notes } = req.body;

      const result = await this.updateAppointmentUseCase.execute({
        id,
        date: date ? new Date(date) : undefined,
        duration,
        reason,
        notes
      });

      if (result.isSuccess()) {
        const appointmentDTO = mapAppointmentToDTO(result.getValue());
        res.status(200).json({ appointment: appointmentDTO });
      } else {
        res.status(400).json({ error: result.getError() });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  /**
   * Cancela una cita
   */
  async cancelAppointment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { cancellationReason } = req.body;
      
      const result = await this.cancelAppointmentUseCase.execute({
        id,
        cancellationReason
      });

      if (result.isSuccess()) {
        const appointmentDTO = mapAppointmentToDTO(result.getValue());
        res.status(200).json({ appointment: appointmentDTO });
      } else {
        res.status(400).json({ error: result.getError() });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  /**
   * Marca una cita como completada
   */
  async completeAppointment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      
      const result = await this.completeAppointmentUseCase.execute({
        id,
        notes
      });

      if (result.isSuccess()) {
        const appointmentDTO = mapAppointmentToDTO(result.getValue());
        res.status(200).json({ appointment: appointmentDTO });
      } else {
        res.status(400).json({ error: result.getError() });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
} 