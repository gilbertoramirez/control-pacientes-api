import { Collection, MongoClient, ObjectId } from 'mongodb';
import { Patient, Gender, BloodType, ContactInfo, EmergencyContact } from '../../../patients/domain/Patient';
import { PatientRepository, PatientFilter } from '../../../patients/domain/PatientRepository';

/**
 * Implementación del repositorio de pacientes utilizando MongoDB
 */
export class MongoDbPatientRepository implements PatientRepository {
  private collection: Collection;
  
  constructor(private readonly client: MongoClient) {
    this.collection = this.client.db('controlPacientes').collection('patients');
  }

  /**
   * Convierte un documento de MongoDB a una entidad de dominio Patient
   */
  private toEntity(document: any): Patient | null {
    if (!document) return null;

    // Crear ContactInfo con EmergencyContact
    const contactInfo = new ContactInfo(
      document.contactInfo.email,
      document.contactInfo.phone,
      document.contactInfo.address
    );
    
    if (document.contactInfo.emergencyContact) {
      const ec = document.contactInfo.emergencyContact;
      contactInfo.setEmergencyContact(
        new EmergencyContact(ec.name, ec.phone, ec.relationship)
      );
    }

    // Crear y configurar el paciente
    const patient = new Patient(
      document._id.toString(),
      document.name,
      document.lastName,
      new Date(document.birthDate),
      document.gender as Gender,
      contactInfo,
      document.medicalIdentifier,
      document.bloodType as BloodType,
      document.allergies || []
    );

    // Si el paciente no está activo, lo desactivamos
    if (!document.isActive) {
      patient.deactivate();
    }

    return patient;
  }

  /**
   * Convierte una entidad de dominio Patient a un documento para MongoDB
   */
  private toDocument(patient: Patient): any {
    const contactInfo = patient.getContactInfo();
    const emergencyContact = contactInfo.getEmergencyContact();

    const document = {
      name: patient.getName(),
      lastName: patient.getLastName(),
      birthDate: patient.getBirthDate(),
      gender: patient.getGender(),
      contactInfo: {
        email: contactInfo.getEmail(),
        phone: contactInfo.getPhone(),
        address: contactInfo.getAddress(),
        emergencyContact: emergencyContact ? {
          name: emergencyContact.getName(),
          phone: emergencyContact.getPhone(),
          relationship: emergencyContact.getRelationship()
        } : undefined
      },
      medicalIdentifier: patient.getMedicalIdentifier(),
      bloodType: patient.getBloodType(),
      allergies: patient.getAllergies(),
      isActive: patient.isActivePatient()
    };

    return document;
  }

  async findById(id: string): Promise<Patient | null> {
    try {
      const document = await this.collection.findOne({ _id: new ObjectId(id) });
      return this.toEntity(document);
    } catch (error) {
      console.error(`Error al buscar paciente con ID ${id}:`, error);
      throw error;
    }
  }

  async findByFilter(filter: PatientFilter): Promise<Patient[]> {
    try {
      const query: any = {};

      if (filter.name) {
        query.name = { $regex: filter.name, $options: 'i' };
      }
      
      if (filter.lastName) {
        query.lastName = { $regex: filter.lastName, $options: 'i' };
      }
      
      if (filter.medicalIdentifier) {
        query.medicalIdentifier = filter.medicalIdentifier;
      }
      
      if (filter.email) {
        query['contactInfo.email'] = filter.email;
      }
      
      if (filter.isActive !== undefined) {
        query.isActive = filter.isActive;
      }

      const documents = await this.collection.find(query).toArray();
      return documents.map(doc => this.toEntity(doc)).filter(patient => patient !== null) as Patient[];
    } catch (error) {
      console.error('Error al buscar pacientes por filtro:', error);
      throw error;
    }
  }

  async save(patient: Patient): Promise<void> {
    try {
      const document = this.toDocument(patient);
      const id = patient.getId();
      
      // Si el ID ya existe (no es un string vacío ni undefined), lo usamos
      if (id && id !== '') {
        document._id = new ObjectId(id);
      }
      
      await this.collection.insertOne(document);
    } catch (error) {
      console.error('Error al guardar paciente:', error);
      throw error;
    }
  }

  async update(patient: Patient): Promise<void> {
    try {
      const document = this.toDocument(patient);
      await this.collection.updateOne(
        { _id: new ObjectId(patient.getId()) },
        { $set: document }
      );
    } catch (error) {
      console.error(`Error al actualizar paciente con ID ${patient.getId()}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      // Soft delete: establecer isActive a false
      await this.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { isActive: false } }
      );
    } catch (error) {
      console.error(`Error al eliminar paciente con ID ${id}:`, error);
      throw error;
    }
  }
} 