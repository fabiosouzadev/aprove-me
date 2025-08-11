import { Test, TestingModule } from '@nestjs/testing';
import { PayableController } from './payable.controller';
import { PayableService } from './payable.service';
import { CreatePayableDto } from './dto/create-payable.dto';
import { UpdatePayableDto } from './dto/update-payable.dto';

// Mock dos dados
const mockPayable = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  value: 1000.5,
  emissionDate: new Date('2024-01-01'),
  assignorId: 'assignor-uuid-123',
  createdAt: new Date(),
};

const createPayableDto: CreatePayableDto = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  value: 1000.5,
  emissionDate: new Date('2024-01-01'),
  assignorId: 'assignor-uuid-123',
};

const updatePayableDto: UpdatePayableDto = {
  value: 2000.99,
};

describe('PayableController', () => {
  let controller: PayableController;
  let service: PayableService;

  const mockPayableService = {
    create: jest.fn().mockResolvedValue(mockPayable),
    findAll: jest.fn().mockResolvedValue([mockPayable]),
    findOne: jest.fn().mockResolvedValue(mockPayable),
    update: jest.fn().mockResolvedValue({ ...mockPayable, value: 2000.99 }),
    remove: jest.fn().mockResolvedValue(mockPayable),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayableController],
      providers: [
        {
          provide: PayableService,
          useValue: mockPayableService,
        },
      ],
    }).compile();

    controller = module.get<PayableController>(PayableController);
    service = module.get<PayableService>(PayableService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve chamar payableService.create com os dados corretos', async () => {
      const result = await controller.create(createPayableDto);

      expect(service.create).toHaveBeenCalledWith(createPayableDto);
      expect(result).toEqual(mockPayable);
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista de pagáveis', async () => {
      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockPayable]);
    });
  });

  describe('findOne', () => {
    it('deve chamar payableService.findOne com o ID correto', async () => {
      const result = await controller.findOne(mockPayable.id);

      expect(service.findOne).toHaveBeenCalledWith(mockPayable.id);
      expect(result).toEqual(mockPayable);
    });
  });

  describe('update', () => {
    it('deve chamar payableService.update com o ID e os dados', async () => {
      const result = await controller.update(mockPayable.id, updatePayableDto);

      expect(service.update).toHaveBeenCalledWith(
        mockPayable.id,
        updatePayableDto,
      );
      expect(result).toEqual({ ...mockPayable, value: 2000.99 });
    });
  });

  describe('remove', () => {
    it('deve chamar payableService.remove com o ID correto', async () => {
      const result = await controller.remove(mockPayable.id);

      expect(service.remove).toHaveBeenCalledWith(mockPayable.id);
      expect(result).toEqual(mockPayable);
    });
  });
});
