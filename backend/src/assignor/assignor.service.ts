import { Injectable } from '@nestjs/common';
import { CreateAssignorDto } from './dto/create-assignor.dto';
import { UpdateAssignorDto } from './dto/update-assignor.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AssignorService {
  constructor(private readonly prisma: PrismaService) {}
  create(createAssignorDto: CreateAssignorDto) {
    return this.prisma.assignor.create({ data: { ...createAssignorDto } });
  }

  async findAll() {
    return await this.prisma.assignor.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.assignor.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, updateAssignorDto: UpdateAssignorDto) {
    return await this.prisma.payable.update({
      where: { id: id },
      data: { ...updateAssignorDto },
    });
  }

  async remove(id: string) {
    return await this.prisma.payable.delete({ where: { id: id } });
  }
}
