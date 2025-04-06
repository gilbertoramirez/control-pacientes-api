import { MongoClient, ObjectId } from 'mongodb';
import { Appointment, AppointmentStatus } from '../../../appointments/domain/Appointment';
import { AppointmentRepository, AppointmentFilters } from '../../../appointments/domain/AppointmentRepository';

/**
 * Implementación del repositorio de citas utilizando MongoDB
 */
export class MongoDbAppointmentRepository implements AppointmentRepository {
  private readonly collectionName = 'appointments';

  constructor(private readonly client: MongoClient) {}

  /**
   * Guarda una nueva cita en la base de datos
   */
  async save(appointment: Appointment): Promise<void> {
    const collection = this.client.db().collection(this.collectionName);
    
    const appointmentData = {
      _id: appointment.getId(),
      patientId: appointment.getPatientId(),
      doctorId: appointment.getDoctorId(),
      date: appointment.getDate(),
      duration: appointment.getDuration(),
      reason: appointment.getReason(),
      status: appointment.getStatus(),
      notes: appointment.getNotes(),
      createdAt: appointment.getCreatedAt(),
      updatedAt: appointment.getUpdatedAt()
    };

    await collection.insertOne(appointmentData);
  }

  /**
   * Actualiza una cita existente
   */
  async update(appointment: Appointment): Promise<void> {
    const collection = this.client.db().collection(this.collectionName);
    
    const appointmentData = {
      patientId: appointment.getPatientId(),
      doctorId: appointment.getDoctorId(),
      date: appointment.getDate(),
      duration: appointment.getDuration(),
      reason: appointment.getReason(),
      status: appointment.getStatus(),
      notes: appointment.getNotes(),
      updatedAt: new Date()
    };

    await collection.updateOne(
      { _id: appointment.getId() },
      { $set: appointmentData }
    );
  }

  /**
   * Busca una cita por su ID
   */
  async findById(id: string): Promise<Appointment | null> {
    const collection = this.client.db().collection(this.collectionName);
    const appointmentData = await collection.findOne({ _id: id });

    if (!appointmentData) {
      return null;
    }

    return new Appointment(
      appointmentData._id,
      appointmentData.patientId,
      appointmentData.doctorId,
      new Date(appointmentData.date),
      appointmentData.duration,
      appointmentData.reason,
      appointmentData.status,
      appointmentData.notes,
      new Date(appointmentData.createdAt),
      new Date(appointmentData.updatedAt)
    );
  }

  /**
   * Busca citas según los filtros proporcionados
   */
  async findAll(filters?: AppointmentFilters): Promise<Appointment[]> {
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
    
    // Filtro de rango de fechas
    if (filters?.dateFrom || filters?.dateTo) {
      query.date = {};
      
      if (filters.dateFrom) {
        query.date.$gte = filters.dateFrom;
      }
      
      if (filters.dateTo) {
        query.date.$lte = filters.dateTo;
      }
    }
    
    // Configurar paginación
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;
    
    // Ejecutar consulta
    const appointmentsData = await collection
      .find(query)
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Mapear resultados a entidades de dominio
    return appointmentsData.map(data => new Appointment(
      data._id,
      data.patientId,
      data.doctorId,
      new Date(data.date),
      data.duration,
      data.reason,
      data.status,
      data.notes,
      new Date(data.createdAt),
      new Date(data.updatedAt)
    ));
  }

  /**
   * Verifica disponibilidad para una cita
   */
  async checkAvailability(
    doctorId: string, 
    date: Date, 
    duration: number,
    excludeAppointmentId?: string
  ): Promise<boolean> {
    const collection = this.client.db().collection(this.collectionName);
    
    // Calcular ventana de tiempo para la cita
    const startTime = new Date(date);
    const endTime = new Date(startTime.getTime() + duration * 60000); // convertir minutos a milisegundos
    
    // Consulta para buscar citas que se solapen
    const query: any = {
      doctorId,
      status: { $in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED, AppointmentStatus.IN_PROGRESS] },
      $or: [
        // Cita que comienza durante otra cita
        { date: { $lt: endTime, $gte: startTime } },
        // Cita que termina durante otra cita
        {
          $expr: {
            $and: [
              { $lt: [{ $toDate: "$date" }, startTime] },
              { $gt: [{ $add: [{ $toDate: "$date" }, { $multiply: ["$duration", 60000] }] }, startTime] }
            ]
          }
        }
      ]
    };
    
    // Si estamos actualizando una cita existente, excluirla de la verificación
    if (excludeAppointmentId) {
      query._id = { $ne: excludeAppointmentId };
    }
    
    // Verificar si hay citas solapadas
    const conflictingAppointment = await collection.findOne(query);
    
    // Retornar true si no hay conflictos
    return !conflictingAppointment;
  }

  /**
   * Cuenta el número total de citas según los filtros
   */
  async count(filters?: AppointmentFilters): Promise<number> {
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
    
    // Filtro de rango de fechas
    if (filters?.dateFrom || filters?.dateTo) {
      query.date = {};
      
      if (filters.dateFrom) {
        query.date.$gte = filters.dateFrom;
      }
      
      if (filters.dateTo) {
        query.date.$lte = filters.dateTo;
      }
    }
    
    return await collection.countDocuments(query);
  }
} 