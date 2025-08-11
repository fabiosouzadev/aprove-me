import { IsUUID, IsNumber, IsDateString } from 'class-validator';

export class CreatePayableDto {
  @IsUUID()
  id: string;

  @IsNumber()
  value: number;

  @IsDateString()
  emissionDate: Date;

  @IsUUID()
  assignorId: string;
}
