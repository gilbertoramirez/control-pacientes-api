import { Application } from 'express';
import { patientRoutes } from './patientRoutes';

/**
 * Registra todas las rutas de la aplicación
 */
export function registerRoutes(app: Application): void {
  // Ruta base de la API
  const apiRouter = '/api/v1';
  
  // Registrar rutas de pacientes
  app.use(`${apiRouter}/patients`, patientRoutes);
  
  // Aquí se registrarían otras rutas (appointments, treatments, etc.)
  
  // Ruta para health check
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API funcionando correctamente' });
  });
  
  // Manejador para rutas no encontradas
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
  });
} 