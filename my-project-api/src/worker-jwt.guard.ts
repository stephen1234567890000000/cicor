import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { env } from 'cloudflare:workers';
import { jwtVerify } from 'jose';

@Injectable()
export class WorkerJwtGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (
      typeof authorization !== 'string' ||
      !authorization.startsWith('Bearer ')
    ) {
      throw new UnauthorizedException(
        'Bearer token is required. Please login first.',
      );
    }

    const token = authorization.slice(7).trim();
    const secret = env.JWT_SECRET;

    if (!secret) {
      throw new InternalServerErrorException('JWT_SECRET belum dikonfigurasi');
    }

    try {
      const secretKey = new TextEncoder().encode(secret);

      const { payload } = await jwtVerify(token, secretKey, {
        algorithms: ['HS256'],
      });

      if (
        typeof payload.id !== 'string' ||
        typeof payload.email !== 'string' ||
        typeof payload.role !== 'string'
      ) {
        throw new UnauthorizedException('Payload JWT tidak valid');
      }

      request.user = {
        userId: payload.id,
        email: payload.email,
        role: payload.role,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException(
        'Invalid or expired token. Please login again.',
      );
    }
  }
}
