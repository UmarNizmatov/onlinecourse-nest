import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { user_role } from '../entities/role.enum';

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;
  @IsString()
  @IsNotEmpty()
  password!: string;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEnum(user_role)
  role!: user_role;
}
