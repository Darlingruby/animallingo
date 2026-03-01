import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

// Validation schemas
const trainingSessionSchema = z.object({
  sessionType: z.enum(['correction', 'validation', 'new_pattern']),
  petId: z.string().uuid().optional(),
  inputData: z.string(),
  expectedOutput: z.string(),
  modelPrediction: z.string().optional(),
  wasCorrect: z.boolean().optional(),
  userCorrection: z.string().optional(),
  notes: z.string().optional(),
});

export async function trainingRoutes(app: FastifyInstance) {
  // All routes require authentication
  app.addHook('onRequest', authenticate);

  // Get training sessions
  app.get('/', async (request, reply) => {
    const user = request.user;
    const { petId, limit = '50', offset = '0' } = request.query as any;

    const sessions = await prisma.trainingSession.findMany({
      where: {
        userId: user.id,
        ...(petId && { petId }),
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    return { success: true, data: sessions };
  });

  // Create training session
  app.post('/', async (request, reply) => {
    const user = request.user;
    const body = trainingSessionSchema.parse(request.body);

    // Verify pet belongs to user (if provided)
    if (body.petId) {
      const pet = await prisma.pet.findFirst({
        where: {
          id: body.petId,
          ownerId: user.id,
        },
      });

      if (!pet) {
        return reply.status(404).send({
          success: false,
          error: { code: 404, message: 'Pet not found' },
        });
      }
    }

    const session = await prisma.trainingSession.create({
      data: {
        userId: user.id,
        sessionType: body.sessionType,
        petId: body.petId,
        inputData: body.inputData,
        expectedOutput: body.expectedOutput,
        modelPrediction: body.modelPrediction,
        wasCorrect: body.wasCorrect,
        userCorrection: body.userCorrection,
        notes: body.notes,
      },
    });

    return reply.status(201).send({
      success: true,
      data: session,
      message: 'Training session recorded. This helps improve the AI!',
    });
  });

  // Get training stats
  app.get('/stats', async (request, reply) => {
    const user = request.user;

    const totalSessions = await prisma.trainingSession.count({
      where: { userId: user.id },
    });

    const corrections = await prisma.trainingSession.count({
      where: {
        userId: user.id,
        wasCorrect: false,
      },
    });

    const byType = await prisma.trainingSession.groupBy({
      by: ['sessionType'],
      where: { userId: user.id },
      _count: {
        id: true,
      },
    });

    return {
      success: true,
      data: {
        totalSessions,
        corrections,
        accuracy: totalSessions > 0 
          ? ((totalSessions - corrections) / totalSessions * 100).toFixed(1)
          : 0,
        byType,
      },
    };
  });

  // Get single training session
  app.get('/:id', async (request, reply) => {
    const user = request.user;
    const { id } = request.params as any;

    const session = await prisma.trainingSession.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!session) {
      return reply.status(404).send({
        success: false,
        error: { code: 404, message: 'Training session not found' },
      });
    }

    return { success: true, data: session };
  });
}
