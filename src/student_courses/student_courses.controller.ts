import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { StudentCoursesService } from './student_courses.service';
import { UpdateStudentCourseDto } from './dto/update-student_course.dto';
import type { Request } from 'express';
import { CreateEnrollmentDto } from './dto/enrollment.dto';

@Controller('student-courses')
export class StudentCoursesController {
  constructor(private readonly studentCoursesService: StudentCoursesService) {}

  @Post()
  create(@Body() createEnrollmentDto: CreateEnrollmentDto, @Req() req: Request) {
    return this.studentCoursesService.create(createEnrollmentDto, req.user!.id);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.studentCoursesService.findAll(req.user!.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentCoursesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentCourseDto: UpdateStudentCourseDto) {
    return this.studentCoursesService.update(id, updateStudentCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentCoursesService.remove(+id);
  }
}
