import dotenv from 'dotenv';
import { Server } from './infrastructure/api/server';

// Cargar variables de entorno
dotenv.config();

// Crear instancia del servidor con el puerto de las variables de entorno
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const server = new Server(port);

// Iniciar el servidor
server.start().catch(error => {
  console.error('Error fatal al iniciar la aplicación:', error);
  process.exit(1);
});

// Manejar señales de terminación para una salida limpia
const shutdownGracefully = async (signal: string) => {
  console.log(`${signal} recibido. Cerrando la aplicación de forma controlada...`);
  process.exit(0);
};

process.on('SIGINT', () => shutdownGracefully('SIGINT'));
process.on('SIGTERM', () => shutdownGracefully('SIGTERM')); 