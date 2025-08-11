import { Injectable } from '@nestjs/common';
import { CreatePayableDto } from './dto/create-payable.dto';

@Injectable()
export class PayableService {
  create(createPayableDto: CreatePayableDto) {
    return { message: 'Recebível válido', createPayableDto };
  }
}
