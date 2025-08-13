import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

jest.mock('bcrypt');

const mockPassword = 'strong_password_123';
const hashedPassword = 'hashed_password_string';

const mockUser = {
  id: 'user-id-123',
  login: 'testuser',
  role: 'operator',
  createdAt: new Date(),
};

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;
  const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
    mockedBcrypt.hash.mockResolvedValue(hashedPassword);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should hash the password and create a user with default role', async () => {
      const createDto: CreateUserDto = {
        login: 'newuser',
        password: mockPassword,
      };

      const expectedUser = { ...mockUser, login: 'newuser' };
      prisma.user.create = jest.fn().mockResolvedValue(expectedUser);

      const result = await service.create(createDto);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith(mockPassword, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          login: createDto.login,
          password: hashedPassword,
          role: 'operator',
        },
        select: {
          id: true,
          login: true,
          role: true,
          createdAt: true,
        },
      });
      expect(result).toEqual(expectedUser);
    });

    it('should create a user with a specified role', async () => {
      const createDto: CreateUserDto = {
        login: 'adminuser',
        password: mockPassword,
        role: 'admin',
      };

      await service.create(createDto);

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            role: 'admin', // Verifica que o papel especificado foi usado
          }),
        }),
      );
    });
  });

  describe('findOneById', () => {
    it('should find a user by id and return selected fields', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      const result = await service.findOneById(mockUser.id);

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        select: { id: true, login: true, role: true, createdAt: true },
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.findOneById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update user data and re-hash password if provided', async () => {
      const updateDto: UpdateUserDto = {
        login: 'updateduser',
        password: 'new_password',
      };
      const expectedUpdatedUser = { ...mockUser, login: 'updateduser' };
      prisma.user.update = jest.fn().mockResolvedValue(expectedUpdatedUser);

      const result = await service.update(mockUser.id, updateDto);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith(updateDto.password, 10);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: {
          login: updateDto.login,
          password: hashedPassword,
        },
        select: { id: true, login: true, role: true, createdAt: true },
      });
      expect(result).toEqual(expectedUpdatedUser);
    });

    it('should update user data without hashing password if not provided', async () => {
      const updateDto: UpdateUserDto = { role: 'admin' };
      prisma.user.update = jest.fn().mockResolvedValue(mockUser);

      await service.update(mockUser.id, updateDto);

      expect(mockedBcrypt.hash).not.toHaveBeenCalled();
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            role: 'admin',
          },
        }),
      );
    });
  });

  describe('remove', () => {
    it('should delete a user and return a confirmation', async () => {
      prisma.user.delete = jest.fn().mockResolvedValue(mockUser);

      const result = await service.remove(mockUser.id);

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(result).toEqual({ deleted: true });
    });
  });
});
