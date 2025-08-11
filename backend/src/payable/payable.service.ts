import { Injectable } from '@nestjs/common';
import { CreatePayableDto } from './dto/create-payable.dto';
import { UpdatePayableDto } from './dto/update-payable.dto';
import { PrismaService } from '../../src/prisma.service';

@Injectable()
export class PayableService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPayableDto: CreatePayableDto) {
    return this.prisma.payable.create({
      data: {
        id: createPayableDto.id,
        value: createPayableDto.value,
        emissionDate: new Date(createPayableDto.emissionDate),
        assignorId: createPayableDto.assignorId,
      },
    });
  }

  async findAll() {
    return await this.prisma.payable.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.payable.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, updatePayableDto: UpdatePayableDto) {
    return await this.prisma.payable.update({
      where: { id: id },
      data: { ...updatePayableDto },
    });
  }

  async remove(id: string) {
    return await this.prisma.payable.delete({ where: { id: id } });
  }
}
