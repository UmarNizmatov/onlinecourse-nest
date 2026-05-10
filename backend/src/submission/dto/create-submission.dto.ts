import { IsOptional, IsString, IsUUID, IsNumber, Min } from 'class-validator';

export class CreateSubmissionDto {
  @IsUUID()
  assignmentId!: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsNumber()
  @Min(0)
  score?: number;
}
