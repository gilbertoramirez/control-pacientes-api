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

// Función que crea y devuelve el controlador de tratamientos
const getTreatmentController = (): TreatmentController => {
  const treatmentRepository = new MongoDbTreatmentRepository(getMongoClient());
  const createTreatmentUseCase = new CreateTreatmentUseCase(treatmentRepository);
  const getTreatmentUseCase = new GetTreatmentUseCase(treatmentRepository);
  const listTreatmentsUseCase = new ListTreatmentsUseCase(treatmentRepository);
  const updateTreatmentUseCase = new UpdateTreatmentUseCase(treatmentRepository);
  const completeTreatmentUseCase = new CompleteTreatmentUseCase(treatmentRepository);
  const cancelTreatmentUseCase = new CancelTreatmentUseCase(treatmentRepository);
  const reactivateTreatmentUseCase = new ReactivateTreatmentUseCase(treatmentRepository);

  return new TreatmentController(
    createTreatmentUseCase,
    getTreatmentUseCase,
    listTreatmentsUseCase,
    updateTreatmentUseCase,
    completeTreatmentUseCase,
    cancelTreatmentUseCase,
    reactivateTreatmentUseCase
  );
};

// Variable para almacenar el controlador (singleton)
let treatmentController: TreatmentController | null = null;

// Helper para obtener el controlador (inicialización perezosa)
const getController = () => {
  if (!treatmentController) {
    treatmentController = getTreatmentController();
  }
  return treatmentController;
};

// Definir las rutas usando el helper
router.post('/', (req, res) => getController().createTreatment(req, res));
router.get('/:id', (req, res) => getController().getTreatment(req, res));
router.get('/', (req, res) => getController().listTreatments(req, res));
router.put('/:id', (req, res) => getController().updateTreatment(req, res));
router.post('/:id/complete', (req, res) => getController().completeTreatment(req, res));
router.post('/:id/cancel', (req, res) => getController().cancelTreatment(req, res));
router.post('/:id/reactivate', (req, res) => getController().reactivateTreatment(req, res));

export const treatmentRoutes = router; 