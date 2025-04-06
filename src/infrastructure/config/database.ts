import { MongoClient } from 'mongodb';

// Configuración de la base de datos
export const mongoConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  dbName: process.env.MONGODB_DB_NAME || 'controlPacientes',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Otras opciones que puedan ser necesarias
  }
};

// Cliente de MongoDB
let client: MongoClient;

/**
 * Conecta a la base de datos MongoDB
 */
export async function connectToDatabase(): Promise<MongoClient> {
  if (client) {
    return client;
  }

  try {
    client = new MongoClient(mongoConfig.uri);
    await client.connect();
    console.log('Conexión exitosa a MongoDB');
    return client;
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    throw error;
  }
}

/**
 * Cierra la conexión a la base de datos MongoDB
 */
export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close();
    console.log('Conexión a MongoDB cerrada');
  }
}

/**
 * Obtiene el cliente de MongoDB
 */
export function getMongoClient(): MongoClient {
  if (!client) {
    throw new Error('La conexión a la base de datos no ha sido inicializada');
  }
  return client;
} 