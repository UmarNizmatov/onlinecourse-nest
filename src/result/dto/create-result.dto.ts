import {
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateSubmissionDto {
  @IsUUID()
  assignmentId!: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;
}