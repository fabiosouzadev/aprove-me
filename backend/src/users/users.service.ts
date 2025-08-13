import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        login: dto.login,
        password: hash,
        role: dto.role ?? 'operator',
      },
      select: {
        id: true,
        login: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, login: true, role: true, createdAt: true },
    });
  }

  async findOneByLogin(login: string) {
    return this.prisma.user.findUnique({ where: { login } });
  }

  async findOneById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, login: true, role: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const data: any = {};
    if (dto.login) data.login = dto.login;
    if (dto.password) data.password = await bcrypt.hash(dto.password, 10);
    if (dto.role) data.role = dto.role;
    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, login: true, role: true, createdAt: true },
    });
  }

  async remove(id: string) {
    await this.prisma.user.delete({ where: { id } });
    return { deleted: true };
  }
}
