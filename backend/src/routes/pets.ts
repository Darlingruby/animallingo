import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

// Validation schemas
const createPetSchema = z.object({
  name: z.string().min(1),
  species: z.enum(['dog', 'cat', 'bird', 'dolphin', 'reptile', 'other']),
  breed: z.string().optional(),
  birthDate: z.string().datetime().optional(),
  gender: z.enum(['male', 'female', 'unknown']).optional(),
});

const updatePetSchema = createPetSchema.partial();

export async function petRoutes(app: FastifyInstance) {
  // All routes require authentication
  app.addHook('onRequest', authenticate);

  // Get all pets for user
  app.get('/', async (request, reply) => {
    const user = request.user;

    const pets = await prisma.pet.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { translations: true },
        },
      },
    });

    return { success: true, data: pets };
  });

  // Create pet
  app.post('/', async (request, reply) => {
    const user = request.user;
    const body = createPetSchema.parse(request.body);

    const pet = await prisma.pet.create({
      data: {
        ownerId: user.id,
        name: body.name,
        species: body.species,
        breed: body.breed,
        birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
        gender: body.gender,
      },
    });

    return reply.status(201).send({
      success: true,
      data: pet,
    });
  });

  // Get single pet
  app.get('/:id', async (request, reply) => {
    const user = request.user;
    const { id } = request.params as any;

    const pet = await prisma.pet.findFirst({
      where: {
        id,
        ownerId: user.id,
      },
      include: {
        translations: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        signalPatterns: true,
      },
    });

    if (!pet) {
      return reply.status(404).send({
        success: false,
        error: { code: 404, message: 'Pet not found' },
      });
    }

    return { success: true, data: pet };
  });

  // Update pet
  app.put('/:id', async (request, reply) => {
    const user = request.user;
    const { id } = request.params as any;
    const body = updatePetSchema.parse(request.body);

    const pet = await prisma.pet.findFirst({
      where: {
        id,
        ownerId: user.id,
      },
    });

    if (!pet) {
      return reply.status(404).send({
        success: false,
        error: { code: 404, message: 'Pet not found' },
      });
    }

    const updatedPet = await prisma.pet.update({
      where: { id },
      data: {
        ...body,
        birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
      },
    });

    return { success: true, data: updatedPet };
  });

  // Delete pet
  app.delete('/:id', async (request, reply) => {
    const user = request.user;
    const { id } = request.params as any;

    const pet = await prisma.pet.findFirst({
      where: {
        id,
        ownerId: user.id,
      },
    });

    if (!pet) {
      return reply.status(404).send({
        success: false,
        error: { code: 404, message: 'Pet not found' },
      });
    }

    await prisma.pet.delete({ where: { id } });

    return { success: true, message: 'Pet deleted' };
  });
}
