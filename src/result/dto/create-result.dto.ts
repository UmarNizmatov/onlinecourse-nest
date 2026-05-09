import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateResultDto {
  @IsUUID()
  courseId!: string;

  @IsNumber()
  @Min(0)
  totalScore!: number;
}