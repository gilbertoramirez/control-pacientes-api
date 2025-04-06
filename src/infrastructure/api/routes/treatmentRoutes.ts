import { Router } from 'express';
import { TreatmentController } from '../../../treatments/interfaces/TreatmentController';
import { 
  CreateTreatmentUseCase,
  GetTreatmentUseCase,
  ListTreatmentsUseCase,
  UpdateTreatmentUseCase,
  CompleteTreatmentUseCase,
  CancelTreatmentUseCase,
  ReactivateTreatmentUseCase
} from '../../../treatments/usecases';
import { MongoDbTreatmentRepository } from '../../../infrastructure/persistence/mongodb/MongoDbTreatmentRepository';
import { getMongoClient } from '../../config/database';

// Crear router
const router = Router();

// Crear las dependencias
const treatmentRepository = new MongoDbTreatmentRepository(getMongoClient());
const createTreatmentUseCase = new CreateTreatmentUseCase(treatmentRepository);
const getTreatmentUseCase = new GetTreatmentUseCase(treatmentRepository);
const listTreatmentsUseCase = new ListTreatmentsUseCase(treatmentRepository);
const updateTreatmentUseCase = new UpdateTreatmentUseCase(treatmentRepository);
const completeTreatmentUseCase = new CompleteTreatmentUseCase(treatmentRepository);
const cancelTreatmentUseCase = new CancelTreatmentUseCase(treatmentRepository);
const reactivateTreatmentUseCase = new ReactivateTreatmentUseCase(treatmentRepository);

// Crear el controlador
const treatmentController = new TreatmentController(
  createTreatmentUseCase,
  getTreatmentUseCase,
  listTreatmentsUseCase,
  updateTreatmentUseCase,
  completeTreatmentUseCase,
  cancelTreatmentUseCase,
  reactivateTreatmentUseCase
);

// Definir las rutas
router.post('/', treatmentController.createTreatment.bind(treatmentController));
router.get('/:id', treatmentController.getTreatment.bind(treatmentController));
router.get('/', treatmentController.listTreatments.bind(treatmentController));
router.put('/:id', treatmentController.updateTreatment.bind(treatmentController));
router.post('/:id/complete', treatmentController.completeTreatment.bind(treatmentController));
router.post('/:id/cancel', treatmentController.cancelTreatment.bind(treatmentController));
router.post('/:id/reactivate', treatmentController.reactivateTreatment.bind(treatmentController));

export const treatmentRoutes = router; 