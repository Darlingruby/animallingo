import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

// Validation schemas
const createTranslationSchema = z.object({
  petId: z.string().uuid(),
  inputType: z.enum(['audio', 'video', 'text']),
  signalType: z.string().optional(),
  inputData: z.string().optional(),
});

const feedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  notes: z.string().optional(),
});

export async function translationRoutes(app: FastifyInstance) {
  // All routes require authentication
  app.addHook('onRequest', authenticate);

  // Get translation history
  app.get('/', async (request, reply) => {
    const user = request.user;
    const { petId, limit = '50', offset = '0' } = request.query as any;

    const translations = await prisma.translation.findMany({
      where: {
        userId: user.id,
        ...(petId && { petId }),
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
      include: {
        pet: {
          select: {
            id: true,
            name: true,
            species: true,
          },
        },
      },
    });

    return { success: true, data: translations };
  });

  // Create new translation
  app.post('/', async (request, reply) => {
    const user = request.user;
    const body = createTranslationSchema.parse(request.body);

    // Verify pet belongs to user
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

    // In a real implementation, this would call the ML service
    // For now, return a mock translation
    const mockTranslations: Record<string, string> = {
      dog: "I'm hungry! Can we go for a walk? 🐕",
      cat: "Pet me... but not too much. 😼",
      bird: "Pretty bird! Hello! 🦜",
      default: "I'm trying to tell you something! 🐾",
    };

    const translatedText = mockTranslations[pet.species] || mockTranslations.default;

    const translation = await prisma.translation.create({
      data: {
        petId: body.petId,
        userId: user.id,
        inputType: body.inputType,
        signalType: body.signalType || 'unknown',
        translatedText,
        modelVersion: '1.0.0',
        processingTime: 250,
        confidence: 0.85,
      },
    });

    return reply.status(201).send({
      success: true,
      data: {
        translation,
        result: {
          text: translatedText,
          confidence: 0.85,
          emotion: 'excited',
        },
      },
    });
  });

  // Get single translation
  app.get('/:id', async (request, reply) => {
    const user = request.user;
    const { id } = request.params as any;

    const translation = await prisma.translation.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        pet: {
          select: {
            id: true,
            name: true,
            species: true,
          },
        },
      },
    });

    if (!translation) {
      return reply.status(404).send({
        success: false,
        error: { code: 404, message: 'Translation not found' },
      });
    }

    return { success: true, data: translation };
  });

  // Add feedback to translation
  app.post('/:id/feedback', async (request, reply) => {
    const user = request.user;
    const { id } = request.params as any;
    const body = feedbackSchema.parse(request.body);

    const translation = await prisma.translation.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!translation) {
      return reply.status(404).send({
        success: false,
        error: { code: 404, message: 'Translation not found' },
      });
    }

    await prisma.translation.update({
      where: { id },
      data: {
        feedbackRating: body.rating,
        feedbackNotes: body.notes,
      },
    });

    return { success: true, message: 'Feedback recorded' };
  });

  // Delete translation
  app.delete('/:id', async (request, reply) => {
    const user = request.user;
    const { id } = request.params as any;

    const translation = await prisma.translation.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!translation) {
      return reply.status(404).send({
        success: false,
        error: { code: 404, message: 'Translation not found' },
      });
    }

    await prisma.translation.delete({ where: { id } });

    return { success: true, message: 'Translation deleted' };
  });
}
