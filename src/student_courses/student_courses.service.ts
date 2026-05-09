import { Injectable } from '@nestjs/common';
import { CreateStudentCourseDto } from './dto/create-student_course.dto';
import { UpdateStudentCourseDto } from './dto/update-student_course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from 'src/auth/entities/auth.entity';

@Injectable()
export class StudentCoursesService {
  constructor(
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
  ) {}
  create(createStudentCourseDto: CreateStudentCourseDto) {
    return 'This action adds a new studentCourse';
  }

  findAll() {
    return `This action returns all studentCourses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studentCourse`;
  }

  update(id: number, updateStudentCourseDto: UpdateStudentCourseDto) {
    return `This action updates a #${id} studentCourse`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentCourse`;
  }
  getUserCourses(userId: string) {}
}
