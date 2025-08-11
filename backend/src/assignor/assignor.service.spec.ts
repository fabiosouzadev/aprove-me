import { Test, TestingModule } from '@nestjs/testing';
import { AssignorService } from './assignor.service';
import { PrismaService } from '../../src/prisma.service';
import { CreateAssignorDto } from './dto/create-assignor.dto';
import { UpdateAssignorDto } from './dto/update-assignor.dto';

const mockAssignor = {
  id: 'a0b1c2d3-e4f5-g6h7-i8j9-k0l1m2n3o4p5',
  document: '123.456.789-00',
  email: 'test@example.com',
  phone: '11999998888',
  name: 'Test Assignor',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrismaService = {
  assignor: {
    create: jest.fn().mockResolvedValue(mockAssignor),
    findMany: jest.fn().mockResolvedValue([mockAssignor]),
    findUnique: jest.fn().mockResolvedValue(mockAssignor),
    update: jest
      .fn()
      .mockResolvedValue({ ...mockAssignor, name: 'Updated Name' }),
    delete: jest.fn().mockResolvedValue(mockAssignor),
  },
};

describe('AssignorService', () => {
  let service: AssignorService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignorService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AssignorService>(AssignorService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an assignor using prisma', async () => {
      // Arrange
      const createDto: CreateAssignorDto = {
        id: mockAssignor.id,
        document: mockAssignor.document,
        email: mockAssignor.email,
        phone: mockAssignor.phone,
        name: mockAssignor.name,
      };

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(result).toEqual(mockAssignor);
      expect(prisma.assignor.create).toHaveBeenCalledWith({ data: createDto });
      expect(prisma.assignor.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of assignors', async () => {
      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual([mockAssignor]);
      expect(prisma.assignor.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single assignor by id', async () => {
      // Act
      const result = await service.findOne(mockAssignor.id);

      // Assert
      expect(result).toEqual(mockAssignor);
      expect(prisma.assignor.findUnique).toHaveBeenCalledWith({
        where: { id: mockAssignor.id },
      });
      expect(prisma.assignor.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update an assignor using prisma.assignor.update', async () => {
      // Arrange
      const updateDto: UpdateAssignorDto = { name: 'Updated Name' };
      const expectedResult = { ...mockAssignor, name: 'Updated Name' };

      // Act
      const result = await service.update(mockAssignor.id, updateDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(prisma.assignor.update).toHaveBeenCalledWith({
        where: { id: mockAssignor.id },
        data: updateDto,
      });
      expect(prisma.assignor.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove an assignor using prisma.assignor.delete', async () => {
      // Act
      const result = await service.remove(mockAssignor.id);

      // Assert
      expect(result).toEqual(mockAssignor);
      expect(prisma.assignor.delete).toHaveBeenCalledWith({
        where: { id: mockAssignor.id },
      });
      expect(prisma.assignor.delete).toHaveBeenCalledTimes(1);
    });
  });
});
