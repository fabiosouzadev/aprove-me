import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockUser = {
  id: 'user-id-123',
  login: 'testuser',
  password: 'hashed_password_from_db',
  role: 'admin',
  createdAt: new Date(),
};

const mockAccessToken = 'mock.jwt.token.string';

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
  },
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;
  const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return the user if credentials are valid', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.validateUser('testuser', 'correct_password');

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { login: 'testuser' },
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        'correct_password',
        mockUser.password,
      );
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(
        service.validateUser('unknownuser', 'any_password'),
      ).rejects.toThrow(new UnauthorizedException('Credenciais inválidas'));
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      await expect(
        service.validateUser('testuser', 'wrong_password'),
      ).rejects.toThrow(new UnauthorizedException('Credenciais inválidas'));
    });
  });

  describe('login', () => {
    it('should validate user and return an access token object', async () => {
      const validateUserSpy = jest
        .spyOn(service, 'validateUser')
        .mockResolvedValue(mockUser);

      jwtService.sign = jest.fn().mockReturnValue(mockAccessToken);

      const result = await service.login({
        login: 'testuser',
        password: 'correct_password',
      });

      expect(validateUserSpy).toHaveBeenCalledWith(
        'testuser',
        'correct_password',
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        login: mockUser.login,
        role: mockUser.role,
      });
      expect(result).toEqual({
        access_token: mockAccessToken,
        expires_in: 60,
      });
    });

    it('should propagate UnauthorizedException from validateUser', async () => {
      jest
        .spyOn(service, 'validateUser')
        .mockRejectedValue(new UnauthorizedException('Credenciais inválidas'));

      await expect(
        service.login({ login: 'testuser', password: 'wrong_password' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
