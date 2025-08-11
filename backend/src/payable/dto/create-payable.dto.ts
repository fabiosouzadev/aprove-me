import { IsUUID, IsNumber, IsDateString, IsNotEmpty } from 'class-validator';

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
