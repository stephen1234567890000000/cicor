import {
  Injectable,
  Inject,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import { SignJWT } from 'jose';
import { env } from 'cloudflare:workers';

@Injectable()
export class WorkerAuthService {
  constructor(
    @Inject('WORKER_PRISMA')
    private readonly prismaFactory: {
      create: () => PrismaClient;
    },
  ) {}

  async login(dto: { email: string; password: string }) {
    const secret = env.JWT_SECRET;

    if (!secret) {
      throw new InternalServerErrorException('JWT_SECRET belum dikonfigurasi');
    }

    const prisma = this.prismaFactory.create();

    try {
      const user = await prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordValid = await compare(dto.password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const secretKey = new TextEncoder().encode(secret);

      const accessToken = await new SignJWT({
        id: user.id,
        email: user.email,
        role: user.role,
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(secretKey);

      return {
        access_token: accessToken,
        token_type: 'Bearer',
      };
    } finally {
      await prisma.$disconnect();
    }
  }
}
