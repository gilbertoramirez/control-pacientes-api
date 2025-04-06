import { MongoClient, ObjectId } from 'mongodb';
import { Treatment, TreatmentStatus, TreatmentType } from '../../../treatments/domain/Treatment';
import { TreatmentRepository, TreatmentFilters } from '../../../treatments/domain/TreatmentRepository';

/**
 * Implementación del repositorio de tratamientos utilizando MongoDB
 */
export class MongoDbTreatmentRepository implements TreatmentRepository {
  private readonly collectionName = 'treatments';

  constructor(private readonly client: MongoClient) {}

  /**
   * Guarda un nuevo tratamiento en la base de datos
   */
  async save(treatment: Treatment): Promise<void> {
    const collection = this.client.db().collection(this.collectionName);
    
    const treatmentData = {
      _id: treatment.getId(),
      patientId: treatment.getPatientId(),
      doctorId: treatment.getDoctorId(),
      name: treatment.getName(),
      description: treatment.getDescription(),
      type: treatment.getType(),
      status: treatment.getStatus(),
      instructions: treatment.getInstructions(),
      startDate: treatment.getStartDate(),
      endDate: treatment.getEndDate(),
      notes: treatment.getNotes(),
      createdAt: treatment.getCreatedAt(),
      updatedAt: treatment.getUpdatedAt()
    };

    await collection.insertOne(treatmentData as any);
  }

  /**
   * Actualiza un tratamiento existente
   */
  async update(treatment: Treatment): Promise<void> {
    const collection = this.client.db().collection(this.collectionName);
    
    const treatmentData = {
      patientId: treatment.getPatientId(),
      doctorId: treatment.getDoctorId(),
      name: treatment.getName(),
      description: treatment.getDescription(),
      type: treatment.getType(),
      status: treatment.getStatus(),
      instructions: treatment.getInstructions(),
      startDate: treatment.getStartDate(),
      endDate: treatment.getEndDate(),
      notes: treatment.getNotes(),
      updatedAt: treatment.getUpdatedAt()
    };

    await collection.updateOne(
      { _id: new ObjectId(treatment.getId()) },
      { $set: treatmentData }
    );
  }

  /**
   * Busca un tratamiento por su ID
   */
  async findById(id: string): Promise<Treatment | null> {
    const collection = this.client.db().collection(this.collectionName);
    const treatmentData = await collection.findOne({ _id: new ObjectId(id) });

    if (!treatmentData) {
      return null;
    }

    return new Treatment(
      treatmentData._id.toString(),
      treatmentData.patientId,
      treatmentData.doctorId,
      treatmentData.name,
      treatmentData.description,
      treatmentData.type,
      treatmentData.instructions,
      new Date(treatmentData.startDate),
      treatmentData.endDate ? new Date(treatmentData.endDate) : undefined,
      treatmentData.status,
      treatmentData.notes,
      new Date(treatmentData.createdAt),
      new Date(treatmentData.updatedAt)
    );
  }

  /**
   * Busca tratamientos según los filtros proporcionados
   */
  async findAll(filters?: TreatmentFilters): Promise<Treatment[]> {
    const collection = this.client.db().collection(this.collectionName);
    
    // Construir consulta según filtros
    const query: any = {};
    
    if (filters?.patientId) {
      query.patientId = filters.patientId;
    }
    
    if (filters?.doctorId) {
      query.doctorId = filters.doctorId;
    }
    
    if (filters?.status) {
      query.status = filters.status;
    }
    
    if (filters?.type) {
      query.type = filters.type;
    }
    
    if (filters?.active !== undefined) {
      if (filters.active) {
        query.status = TreatmentStatus.ACTIVE;
      } else {
        query.status = { $ne: TreatmentStatus.ACTIVE };
      }
    }
    
    // Filtro de rango de fechas de inicio
    if (filters?.startDateFrom || filters?.startDateTo) {
      query.startDate = {};
      
      if (filters.startDateFrom) {
        query.startDate.$gte = filters.startDateFrom;
      }
      
      if (filters.startDateTo) {
        query.startDate.$lte = filters.startDateTo;
      }
    }
    
    // Configurar paginación
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;
    
    // Ejecutar consulta
    const treatmentsData = await collection
      .find(query)
      .sort({ startDate: 1, name: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Mapear resultados a entidades de dominio
    return treatmentsData.map(data => new Treatment(
      data._id.toString(),
      data.patientId,
      data.doctorId,
      data.name,
      data.description,
      data.type,
      data.instructions,
      new Date(data.startDate),
      data.endDate ? new Date(data.endDate) : undefined,
      data.status,
      data.notes,
      new Date(data.createdAt),
      new Date(data.updatedAt)
    ));
  }

  /**
   * Obtiene todos los tratamientos activos de un paciente
   */
  async findActiveByPatientId(patientId: string): Promise<Treatment[]> {
    const collection = this.client.db().collection(this.collectionName);
    
    const query = {
      patientId,
      status: TreatmentStatus.ACTIVE
    };
    
    const treatmentsData = await collection
      .find(query)
      .sort({ startDate: 1, name: 1 })
      .toArray();
    
    return treatmentsData.map(data => new Treatment(
      data._id.toString(),
      data.patientId,
      data.doctorId,
      data.name,
      data.description,
      data.type,
      data.instructions,
      new Date(data.startDate),
      data.endDate ? new Date(data.endDate) : undefined,
      data.status,
      data.notes,
      new Date(data.createdAt),
      new Date(data.updatedAt)
    ));
  }

  /**
   * Cuenta el número total de tratamientos según los filtros
   */
  async count(filters?: TreatmentFilters): Promise<number> {
    const collection = this.client.db().collection(this.collectionName);
    
    // Construir consulta según filtros
    const query: any = {};
    
    if (filters?.patientId) {
      query.patientId = filters.patientId;
    }
    
    if (filters?.doctorId) {
      query.doctorId = filters.doctorId;
    }
    
    if (filters?.status) {
      query.status = filters.status;
    }
    
    if (filters?.type) {
      query.type = filters.type;
    }
    
    if (filters?.active !== undefined) {
      if (filters.active) {
        query.status = TreatmentStatus.ACTIVE;
      } else {
        query.status = { $ne: TreatmentStatus.ACTIVE };
      }
    }
    
    // Filtro de rango de fechas de inicio
    if (filters?.startDateFrom || filters?.startDateTo) {
      query.startDate = {};
      
      if (filters.startDateFrom) {
        query.startDate.$gte = filters.startDateFrom;
      }
      
      if (filters.startDateTo) {
        query.startDate.$lte = filters.startDateTo;
      }
    }
    
    return await collection.countDocuments(query);
  }
} 