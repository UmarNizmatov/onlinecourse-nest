import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateAssigmentDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxScore?: number;
}
