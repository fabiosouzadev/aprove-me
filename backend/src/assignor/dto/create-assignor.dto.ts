import { IsEmail, IsString, IsUUID, Length, Matches } from 'class-validator';

export class CreateAssignorDto {
  @IsUUID()
  id: string;

  @IsString()
  @Length(1, 30)
  @Matches(/^\d+$/, { message: 'document deve conter apenas números' })
  document: string;

  @IsEmail()
  @Length(1, 140)
  email: string;

  @IsString()
  @Length(1, 20)
  phone: string;

  @IsString()
  @Length(1, 140)
  name: string;
}
