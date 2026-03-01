import { FastifyInstance } from 'fastify';

export async function healthRoutes(app: FastifyInstance) {
  // Public health check
  app.get('/', async () => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'pet-translation-api',
      version: '1.0.0',
    };
  });

  // Detailed health check (includes database)
  app.get('/detailed', async (request, reply) => {
    const checks: Record<string, { status: string; responseTime: number }> = {};
    
    // Check database
    const dbStart = Date.now();
    try {
      const { prisma } = await import('../lib/prisma');
      await prisma.$queryRaw`SELECT 1`;
      checks.database = { status: 'healthy', responseTime: Date.now() - dbStart };
    } catch (err) {
      checks.database = { status: 'unhealthy', responseTime: Date.now() - dbStart };
    }

    const allHealthy = Object.values(checks).every(c => c.status === 'healthy');
    
    return reply.status(allHealthy ? 200 : 503).send({
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      checks,
    });
  });
}
