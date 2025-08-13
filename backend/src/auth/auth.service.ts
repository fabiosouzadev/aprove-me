import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(login: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { login } });
    if (!user) throw new UnauthorizedException('Credenciais inválidas');
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Credenciais inválidas');
    return user;
  }

  async login(payload: { login: string; password: string }) {
    const user = await this.validateUser(payload.login, payload.password);
    const token = this.jwtService.sign({
      sub: user.id,
      login: user.login,
      role: user.role,
    });
    return { access_token: token, expires_in: 60 };
  }
}
