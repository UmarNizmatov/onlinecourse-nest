import { Injectable } from '@nestjs/common';
import { CreateStudentCourseDto } from './dto/create-student_course.dto';
import { UpdateStudentCourseDto } from './dto/update-student_course.dto';

@Injectable()
export class StudentCoursesService {
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
}
