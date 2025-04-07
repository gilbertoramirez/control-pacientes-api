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

// Función que crea y devuelve el controlador de citas
const getAppointmentController = (): AppointmentController => {
  const appointmentRepository = new MongoDbAppointmentRepository(getMongoClient());
  const createAppointmentUseCase = new CreateAppointmentUseCase(appointmentRepository);
  const getAppointmentUseCase = new GetAppointmentUseCase(appointmentRepository);
  const listAppointmentsUseCase = new ListAppointmentsUseCase(appointmentRepository);
  const updateAppointmentUseCase = new UpdateAppointmentUseCase(appointmentRepository);
  const cancelAppointmentUseCase = new CancelAppointmentUseCase(appointmentRepository);
  const completeAppointmentUseCase = new CompleteAppointmentUseCase(appointmentRepository);

  return new AppointmentController(
    createAppointmentUseCase,
    getAppointmentUseCase,
    listAppointmentsUseCase,
    updateAppointmentUseCase,
    cancelAppointmentUseCase,
    completeAppointmentUseCase
  );
};

// Variable para almacenar el controlador (singleton)
let appointmentController: AppointmentController | null = null;

// Helper para obtener el controlador (inicialización perezosa)
const getController = () => {
  if (!appointmentController) {
    appointmentController = getAppointmentController();
  }
  return appointmentController;
};

// Definir las rutas usando el helper
router.post('/', (req, res) => getController().createAppointment(req, res));
router.get('/:id', (req, res) => getController().getAppointment(req, res));
router.get('/', (req, res) => getController().listAppointments(req, res));
router.put('/:id', (req, res) => getController().updateAppointment(req, res));
router.post('/:id/cancel', (req, res) => getController().cancelAppointment(req, res));
router.post('/:id/complete', (req, res) => getController().completeAppointment(req, res));

export const appointmentRoutes = router; 