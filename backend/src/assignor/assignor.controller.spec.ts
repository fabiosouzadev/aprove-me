import { Test, TestingModule } from '@nestjs/testing';
import { AssignorController } from './assignor.controller';
import { AssignorService } from './assignor.service';
import { CreateAssignorDto } from './dto/create-assignor.dto';
import { UpdateAssignorDto } from './dto/update-assignor.dto';

const mockAssignor = {
  id: 'a0b1c2d3-e4f5-g6h7-i8j9-k0l1m2n3o4p5',
  document: '123.456.789-00',
  email: 'test@example.com',
  phone: '11999998888',
  name: 'Test Assignor',
};

const mockAssignorService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('AssignorController', () => {
  let controller: AssignorController;
  let service: AssignorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignorController],
      providers: [
        {
          provide: AssignorService,
          useValue: mockAssignorService,
        },
      ],
    }).compile();

    controller = module.get<AssignorController>(AssignorController);
    service = module.get<AssignorService>(AssignorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an assignor and return it', async () => {
      const createDto: CreateAssignorDto = {
        id: mockAssignor.id,
        document: mockAssignor.document,
        email: mockAssignor.email,
        phone: mockAssignor.phone,
        name: mockAssignor.name,
      };
      mockAssignorService.create.mockResolvedValue(mockAssignor);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockAssignor);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of assignors', async () => {
      mockAssignorService.findAll.mockResolvedValue([mockAssignor]);

      const result = await controller.findAll();

      expect(result).toEqual([mockAssignor]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single assignor by id', async () => {
      mockAssignorService.findOne.mockResolvedValue(mockAssignor);

      const result = await controller.findOne(mockAssignor.id);

      expect(result).toEqual(mockAssignor);
      expect(service.findOne).toHaveBeenCalledWith(mockAssignor.id);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update an assignor and return the updated data', async () => {
      const updateDto: UpdateAssignorDto = { name: 'Updated Name' };
      const updatedAssignor = { ...mockAssignor, ...updateDto };
      mockAssignorService.update.mockResolvedValue(updatedAssignor);

      const result = await controller.update(mockAssignor.id, updateDto);

      expect(result).toEqual(updatedAssignor);
      expect(service.update).toHaveBeenCalledWith(mockAssignor.id, updateDto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove an assignor and return the removed data', async () => {
      mockAssignorService.remove.mockResolvedValue(mockAssignor);

      const result = await controller.remove(mockAssignor.id);

      expect(result).toEqual(mockAssignor);
      expect(service.remove).toHaveBeenCalledWith(mockAssignor.id);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
