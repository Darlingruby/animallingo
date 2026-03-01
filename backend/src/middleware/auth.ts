import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

// Extend FastifyRequest to include user
declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string;
      email: string;
      name: string | null;
    };
  }
}

export const prisma = new PrismaClient();

// Authentication middleware
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return reply.status(401).send({
        success: false,
        error: { code: 401, message: 'Authentication required' },
      });
    }

    // Verify JWT token
    const decoded = await request.jwtVerify<{ userId: string; email: string; name?: string }>();
    
    request.user = {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name || null,
    };
  } catch (err) {
    return reply.status(401).send({
      success: false,
      error: { code: 401, message: 'Invalid or expired token' },
    });
  }
}
