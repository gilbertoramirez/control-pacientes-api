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

// Crear las dependencias
const patientRepository = new MongoDbPatientRepository(getMongoClient());
const createPatientUseCase = new CreatePatientUseCase(patientRepository);
const getPatientUseCase = new GetPatientUseCase(patientRepository);
const listPatientsUseCase = new ListPatientsUseCase(patientRepository);
const updatePatientUseCase = new UpdatePatientUseCase(patientRepository);
const deletePatientUseCase = new DeletePatientUseCase(patientRepository);
const activatePatientUseCase = new ActivatePatientUseCase(patientRepository);
const updatePatientAllergiesUseCase = new UpdatePatientAllergiesUseCase(patientRepository);
const updatePatientContactInfoUseCase = new UpdatePatientContactInfoUseCase(patientRepository);

// Crear el controlador
const patientController = new PatientController(
  createPatientUseCase,
  getPatientUseCase,
  listPatientsUseCase,
  updatePatientUseCase,
  deletePatientUseCase,
  activatePatientUseCase,
  updatePatientAllergiesUseCase,
  updatePatientContactInfoUseCase
);

// Definir las rutas
router.post('/', patientController.createPatient.bind(patientController));
router.get('/:id', patientController.getPatient.bind(patientController));
router.get('/', patientController.listPatients.bind(patientController));
router.put('/:id', patientController.updatePatient.bind(patientController));
router.delete('/:id', patientController.deletePatient.bind(patientController));
router.post('/:id/activate', patientController.activatePatient.bind(patientController));
router.put('/:id/allergies', patientController.updateAllergies.bind(patientController));
router.put('/:id/contact-info', patientController.updateContactInfo.bind(patientController));

export const patientRoutes = router; 