import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import websocket from '@fastify/websocket';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import multipart from '@fastify/multipart';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import dotenv from 'dotenv';
import path from 'path';

// Import routes
import { authRoutes } from './routes/auth';
import { petRoutes } from './routes/pets';
import { translationRoutes } from './routes/translations';
import { trainingRoutes } from './routes/training';
import { healthRoutes } from './routes/health';

// Load environment variables
dotenv.config();

// Create Fastify instance
const app: FastifyInstance = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development' ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    } : undefined
  }
});

// Register type provider for Zod
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Configuration
const PORT = parseInt(process.env.PORT || '3000');
const HOST = process.env.HOST || '0.0.0.0';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function main() {
  // Register plugins
  await app.register(cors, {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://yourdomain.com'] 
      : true,
    credentials: true
  });

  await app.register(jwt, {
    secret: JWT_SECRET,
    sign: {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  });

  await app.register(websocket);

  await app.register(multipart, {
    limits: {
      fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
      files: 1
    }
  });

  // Register Swagger for API documentation
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'AnimalLingo API',
        description: 'AI-powered animal translation service',
        version: '1.0.0'
      },
      servers: [
        {
          url: `http://localhost:${PORT}`,
          description: 'Development server'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    }
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true
    }
  });

  // Register routes
  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(petRoutes, { prefix: '/api/pets' });
  await app.register(translationRoutes, { prefix: '/api/translations' });
  await app.register(trainingRoutes, { prefix: '/api/training' });
  await app.register(healthRoutes, { prefix: '/api/health' });

  // WebSocket handler for real-time translations
  app.get('/ws/translations', { websocket: true }, (connection, req) => {
    connection.socket.on('message', async (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle real-time translation requests
        if (data.type === 'translate') {
          connection.socket.send(JSON.stringify({
            type: 'status',
            message: 'Processing audio...'
          }));
          
          // In a real implementation, this would stream audio to AI service
          setTimeout(() => {
            connection.socket.send(JSON.stringify({
              type: 'result',
              translation: {
                text: "I'm hungry! Feed me please! 🍖",
                confidence: 0.92,
                emotion: 'excited'
              }
            }));
          }, 1000);
        }
      } catch (error) {
        connection.socket.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format'
        }));
      }
    });

    connection.socket.on('close', () => {
      app.log.info('WebSocket connection closed');
    });
  });

  // Global error handler
  app.setErrorHandler((error, request, reply) => {
    app.log.error(error);
    
    const statusCode = error.statusCode || 500;
    const message = statusCode === 500 && process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : error.message;
    
    reply.status(statusCode).send({
      success: false,
      error: {
        code: statusCode,
        message
      }
    });
  });

  // 404 handler
  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      success: false,
      error: {
        code: 404,
        message: 'Route not found'
      }
    });
  });

  // Start server
  try {
    await app.listen({ port: PORT, host: HOST });
    app.log.info(`🚀 Server running at http://${HOST}:${PORT}`);
    app.log.info(`📚 API Documentation at http://${HOST}:${PORT}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  app.log.info('SIGTERM received, closing server gracefully');
  await app.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  app.log.info('SIGINT received, closing server gracefully');
  await app.close();
  process.exit(0);
});

main();

export default app;
