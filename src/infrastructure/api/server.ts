import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectToDatabase } from '../config/database';
import { registerRoutes } from './routes';

/**
 * Clase para la configuración del servidor Express
 */
export class Server {
  private app: Application;
  private port: number;

  constructor(port: number = 3000) {
    this.app = express();
    this.port = port;
    this.setupMiddlewares();
    this.setupRoutes();
  }

  /**
   * Configura los middlewares de la aplicación
   */
  private setupMiddlewares(): void {
    // Middleware de seguridad
    this.app.use(helmet());
    
    // Middleware para CORS
    this.app.use(cors());
    
    // Middleware para parsear JSON
    this.app.use(express.json());
    
    // Middleware para logging
    this.app.use(morgan('dev'));
  }

  /**
   * Configura las rutas de la API
   */
  private setupRoutes(): void {
    registerRoutes(this.app);
  }

  /**
   * Inicia el servidor
   */
  public async start(): Promise<void> {
    try {
      // Conectar a la base de datos
      await connectToDatabase();
      
      // Iniciar el servidor
      this.app.listen(this.port, () => {
        console.log(`Servidor iniciado en el puerto ${this.port}`);
      });
    } catch (error) {
      console.error('Error al iniciar el servidor:', error);
      process.exit(1);
    }
  }
}

/**
 * Punto de entrada para iniciar el servidor
 */
if (require.main === module) {
  const server = new Server();
  server.start();
} 