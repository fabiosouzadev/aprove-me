import { Test, TestingModule } from '@nestjs/testing';
import { PayableService } from './payable.service';
import { CreatePayableDto } from './dto/create-payable.dto';
import { UpdatePayableDto } from './dto/update-payable.dto';
import { PrismaService } from '../../src/prisma.service';

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

describe('PayableService', () => {
  let service: PayableService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayableService, PrismaService],
    }).compile();

    service = module.get<PayableService>(PayableService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um novo recebível', async () => {
      // Simula o retorno do Prisma
      jest.spyOn(prisma.payable, 'create').mockResolvedValue(mockPayable);

      const result = await service.create(createPayableDto);

      expect(result).toEqual(mockPayable);
      expect(prisma.payable.create).toHaveBeenCalledWith({
        data: {
          id: createPayableDto.id,
          value: createPayableDto.value,
          emissionDate: new Date(createPayableDto.emissionDate),
          assignorId: createPayableDto.assignorId,
        },
      });
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista de recebíveis', async () => {
      jest.spyOn(prisma.payable, 'findMany').mockResolvedValue([mockPayable]);

      const result = await service.findAll();

      expect(result).toEqual([mockPayable]);
      expect(prisma.payable.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um recebível pelo ID', async () => {
      jest.spyOn(prisma.payable, 'findUnique').mockResolvedValue(mockPayable);

      const result = await service.findOne(mockPayable.id);

      expect(result).toEqual(mockPayable);
      expect(prisma.payable.findUnique).toHaveBeenCalledWith({
        where: { id: mockPayable.id },
      });
    });

    it('deve retornar null se o ID não existir', async () => {
      jest.spyOn(prisma.payable, 'findUnique').mockResolvedValue(null);

      const result = await service.findOne('invalid-id');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('deve atualizar um recebível', async () => {
      const updatedPayable = { ...mockPayable, value: 2000.99 };
      jest.spyOn(prisma.payable, 'update').mockResolvedValue(updatedPayable);

      const result = await service.update(mockPayable.id, updatePayableDto);

      expect(result).toEqual(updatedPayable);
      expect(prisma.payable.update).toHaveBeenCalledWith({
        where: { id: mockPayable.id },
        data: updatePayableDto,
      });
    });
  });

  describe('remove', () => {
    it('deve remover um recebível', async () => {
      jest.spyOn(prisma.payable, 'delete').mockResolvedValue(mockPayable);

      const result = await service.remove(mockPayable.id);

      expect(result).toEqual(mockPayable);
      expect(prisma.payable.delete).toHaveBeenCalledWith({
        where: { id: mockPayable.id },
      });
    });
  });
});
