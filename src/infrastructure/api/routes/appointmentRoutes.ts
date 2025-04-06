import { Router } from 'express';
import { AppointmentController } from '../../../appointments/interfaces/AppointmentController';
import { 
  CreateAppointmentUseCase,
  GetAppointmentUseCase,
  ListAppointmentsUseCase,
  UpdateAppointmentUseCase,
  CancelAppointmentUseCase,
  CompleteAppointmentUseCase
} from '../../../appointments/usecases';
import { MongoDbAppointmentRepository } from '../../persistence/mongodb/MongoDbAppointmentRepository';
import { getMongoClient } from '../../config/database';

// Crear router
const router = Router();

// Crear las dependencias
const appointmentRepository = new MongoDbAppointmentRepository(getMongoClient());
const createAppointmentUseCase = new CreateAppointmentUseCase(appointmentRepository);
const getAppointmentUseCase = new GetAppointmentUseCase(appointmentRepository);
const listAppointmentsUseCase = new ListAppointmentsUseCase(appointmentRepository);
const updateAppointmentUseCase = new UpdateAppointmentUseCase(appointmentRepository);
const cancelAppointmentUseCase = new CancelAppointmentUseCase(appointmentRepository);
const completeAppointmentUseCase = new CompleteAppointmentUseCase(appointmentRepository);

// Crear el controlador
const appointmentController = new AppointmentController(
  createAppointmentUseCase,
  getAppointmentUseCase,
  listAppointmentsUseCase,
  updateAppointmentUseCase,
  cancelAppointmentUseCase,
  completeAppointmentUseCase
);

// Definir las rutas
router.post('/', appointmentController.createAppointment.bind(appointmentController));
router.get('/:id', appointmentController.getAppointment.bind(appointmentController));
router.get('/', appointmentController.listAppointments.bind(appointmentController));
router.put('/:id', appointmentController.updateAppointment.bind(appointmentController));
router.post('/:id/cancel', appointmentController.cancelAppointment.bind(appointmentController));
router.post('/:id/complete', appointmentController.completeAppointment.bind(appointmentController));

export const appointmentRoutes = router; 