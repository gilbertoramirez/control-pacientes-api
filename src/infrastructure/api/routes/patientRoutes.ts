import { Router } from 'express';
import { PatientController } from '../../../patients/interfaces/PatientController';
import { 
  CreatePatientUseCase,
  GetPatientUseCase,
  ListPatientsUseCase,
  UpdatePatientUseCase,
  DeletePatientUseCase,
  ActivatePatientUseCase,
  UpdatePatientAllergiesUseCase,
  UpdatePatientContactInfoUseCase
} from '../../../patients/usecases';
import { MongoDbPatientRepository } from '../../persistence/mongodb/MongoDbPatientRepository';
import { getMongoClient } from '../../config/database';

// Crear router
const router = Router();

// Función que crea y devuelve el controlador de pacientes
const getPatientController = (): PatientController => {
  const patientRepository = new MongoDbPatientRepository(getMongoClient());
  const createPatientUseCase = new CreatePatientUseCase(patientRepository);
  const getPatientUseCase = new GetPatientUseCase(patientRepository);
  const listPatientsUseCase = new ListPatientsUseCase(patientRepository);
  const updatePatientUseCase = new UpdatePatientUseCase(patientRepository);
  const deletePatientUseCase = new DeletePatientUseCase(patientRepository);
  const activatePatientUseCase = new ActivatePatientUseCase(patientRepository);
  const updatePatientAllergiesUseCase = new UpdatePatientAllergiesUseCase(patientRepository);
  const updatePatientContactInfoUseCase = new UpdatePatientContactInfoUseCase(patientRepository);

  return new PatientController(
    createPatientUseCase,
    getPatientUseCase,
    listPatientsUseCase,
    updatePatientUseCase,
    deletePatientUseCase,
    activatePatientUseCase,
    updatePatientAllergiesUseCase,
    updatePatientContactInfoUseCase
  );
};

// Variable para almacenar el controlador (singleton)
let patientController: PatientController | null = null;

// Helper para obtener el controlador (inicialización perezosa)
const getController = () => {
  if (!patientController) {
    patientController = getPatientController();
  }
  return patientController;
};

// Definir las rutas usando el helper
router.post('/', (req, res) => getController().createPatient(req, res));
router.get('/:id', (req, res) => getController().getPatient(req, res));
router.get('/', (req, res) => getController().listPatients(req, res));
router.put('/:id', (req, res) => getController().updatePatient(req, res));
router.delete('/:id', (req, res) => getController().deletePatient(req, res));
router.post('/:id/activate', (req, res) => getController().activatePatient(req, res));
router.put('/:id/allergies', (req, res) => getController().updateAllergies(req, res));
router.put('/:id/contact-info', (req, res) => getController().updateContactInfo(req, res));

export const patientRoutes = router; 