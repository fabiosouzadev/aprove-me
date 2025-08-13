import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  login: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  role?: string;
}
