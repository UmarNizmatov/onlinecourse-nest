import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { StudentCoursesService } from './student_courses.service';
import { CreateStudentCourseDto } from './dto/create-student_course.dto';
import { UpdateStudentCourseDto } from './dto/update-student_course.dto';
import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import type { Request } from 'express';
import { CreateEnrollmentDto } from './dto/enrollment.dto';

@Controller('student-courses')
@UseGuards(JwtAccessGuard)
export class StudentCoursesController {
  constructor(private readonly studentCoursesService: StudentCoursesService) {}

  @Post()
  create(
    @Body() CreateEnrollmentDto: CreateEnrollmentDto,
    @Req() req: Request,
  ) {
    return this.studentCoursesService.create(CreateEnrollmentDto, req.user!.id);
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
  update(
    @Param('id') id: string,
    @Body() updateStudentCourseDto: UpdateStudentCourseDto,
  ) {
    return this.studentCoursesService.update(id, updateStudentCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentCoursesService.remove(+id);
  }
}
