import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function authRoutes(app: FastifyInstance) {
  // Register
  app.post('/register', async (request, reply) => {
    const body = registerSchema.parse(request.body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return reply.status(409).send({
        success: false,
        error: { code: 409, message: 'Email already registered' },
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(body.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash,
        name: body.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    // Generate JWT
    const token = app.jwt.sign({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return reply.status(201).send({
      success: true,
      data: { user, token },
    });
  });

  // Login
  app.post('/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return reply.status(401).send({
        success: false,
        error: { code: 401, message: 'Invalid credentials' },
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(body.password, user.passwordHash);

    if (!validPassword) {
      return reply.status(401).send({
        success: false,
        error: { code: 401, message: 'Invalid credentials' },
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate JWT
    const token = app.jwt.sign({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
    };
  });

  // Refresh token
  app.post('/refresh', async (request, reply) => {
    try {
      const decoded = await request.jwtVerify<{ userId: string; email: string; name?: string }>();
      
      const newToken = app.jwt.sign({
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name,
      });

      return {
        success: true,
        data: { token: newToken },
      };
    } catch (err) {
      return reply.status(401).send({
        success: false,
        error: { code: 401, message: 'Invalid token' },
      });
    }
  });

  // Get current user
  app.get('/me', async (request, reply) => {
    try {
      const decoded = await request.jwtVerify<{ userId: string }>();
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          lastLoginAt: true,
        },
      });

      if (!user) {
        return reply.status(404).send({
          success: false,
          error: { code: 404, message: 'User not found' },
        });
      }

      return {
        success: true,
        data: { user },
      };
    } catch (err) {
      return reply.status(401).send({
        success: false,
        error: { code: 401, message: 'Invalid token' },
      });
    }
  });
}
