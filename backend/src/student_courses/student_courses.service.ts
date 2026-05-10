import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentCourseDto } from './dto/create-student_course.dto';
import { UpdateStudentCourseDto } from './dto/update-student_course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { CreateEnrollmentDto } from './dto/enrollment.dto';
import { Course } from 'src/courses/entities/course.entity';
import { Enrollment } from './entities/enrollment.entity';

@Injectable()
export class StudentCoursesService {
  constructor(
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
  ) {}
  async create(enrollmentDto: CreateEnrollmentDto, userId: string) {
    const student = await this.authRepo.findOneBy({ id: userId });
    if (!student) throw new NotFoundException('Student not found');
    const course = await this.courseRepo.findOneBy({
      id: enrollmentDto.courseId,
    });
    if (!course) throw new NotFoundException('Course not found');
    const enrollment = this.enrollmentRepo.create({ course, user: student });
    await this.enrollmentRepo.save(enrollment);
    return enrollment;
  }

  findAll(userId: string) {
    return this.enrollmentRepo.find({
      where: { user: { id: userId } },
      relations: ['course', 'user'],
    });
  }

  async findOne(id: string) {
    const enrollment = this.enrollmentRepo.findOne({
      where: { id },
      relations: ['course', 'user'],
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    return enrollment;
  }

  async update(id: string, updateStudentCourseDto: UpdateStudentCourseDto) {
    return `This action updates a #${id} studentCourse`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentCourse`;
  }
  async getUserCourses(userId: string) {
    const data = await this.enrollmentRepo.find({
      where: { user: { id: userId } },
      relations: ['course', 'user'],
    });
    return data;
  }
}
