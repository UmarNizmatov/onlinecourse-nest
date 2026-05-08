import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { CourseLevel } from '../entities/course.entity';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  @IsNotEmpty()
  teacher!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsEnum(CourseLevel)
  level!: CourseLevel;
}
