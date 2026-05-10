import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepo.create(createCourseDto);
    if (!course)
      throw new InternalServerErrorException('Course creation failed');
    await this.courseRepo.save(course);
    return course;
  }

  async findAll(): Promise<Course[]> {
    return this.courseRepo.find();
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepo.findOneBy({ id });
    if (!course) throw new NotFoundException(`Course #${id} not found`);
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);
    Object.assign(course, updateCourseDto);
    return this.courseRepo.save(course);
  }

  async remove(id: string): Promise<{ message: string }> {
    const course = await this.findOne(id);
    await this.courseRepo.remove(course);
    return { message: `Course #${id} deleted successfully` };
  }
  async findOneModule(id: string) {
    const course = await this.courseRepo.findOne({
      where: { id },
      relations: ['modules'],
    });
    if (!course) throw new NotFoundException(`Course #${id} not found`);
    return course.modules;
  }
}
