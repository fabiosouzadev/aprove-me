import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const mockUser = {
  id: 'user-id-123',
  login: 'testuser',
  role: 'operator',
  createdAt: new Date(),
};

const mockUsersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOneById: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call usersService.create and return the result', async () => {
      const createDto: CreateUserDto = {
        login: 'newUser',
        password: 'password',
      };
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockUser);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should call usersService.findAll and return the result', async () => {
      mockUsersService.findAll.mockResolvedValue([mockUser]);

      const result = await controller.findAll();

      expect(result).toEqual([mockUser]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call usersService.findOneById and return the result', async () => {
      mockUsersService.findOneById.mockResolvedValue(mockUser);
      const userId = 'user-id-123';

      const result = await controller.findOne(userId);

      expect(result).toEqual(mockUser);
      expect(service.findOneById).toHaveBeenCalledWith(userId);
    });
  });

  describe('update', () => {
    it('should call usersService.update and return the result', async () => {
      const updateDto: UpdateUserDto = { role: 'admin' };
      const userId = 'user-id-123';
      const updatedUser = { ...mockUser, ...updateDto };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(userId, updateDto);

      expect(result).toEqual(updatedUser);
      expect(service.update).toHaveBeenCalledWith(userId, updateDto);
    });
  });

  describe('remove', () => {
    it('should call usersService.remove and return the result', async () => {
      const confirmation = { deleted: true };
      mockUsersService.remove.mockResolvedValue(confirmation);
      const userId = 'user-id-123';

      const result = await controller.remove(userId);

      expect(result).toEqual(confirmation);
      expect(service.remove).toHaveBeenCalledWith(userId);
    });
  });
});
