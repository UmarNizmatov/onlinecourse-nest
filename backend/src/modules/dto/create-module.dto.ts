import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsUUID()
  @IsNotEmpty()
  courseId!: string;
}
