import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPassword = await bcrypt.compare(dto.password, user.password);
    if (!isPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accesToken = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      access_token: accesToken,
      token_type: 'Bearer',
    }
  }
}
