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
      include: {
        roleRef: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPassword = await bcrypt.compare(dto.password, user.password);

    if (!isPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.roleRef) {
      throw new UnauthorizedException('User role not found');
    }

    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
      role: user.roleRef.roleName,
    });

    return {
      access_token: accessToken,
      name: user.name,
      email: user.email,
      role: user.roleRef.roleName,
      token_type: 'Bearer',
    };
  }
}
