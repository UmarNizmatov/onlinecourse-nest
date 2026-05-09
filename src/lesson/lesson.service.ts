import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { Repository } from 'typeorm/browser/repository/Repository.js';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
  ) {}
  async create(createLessonDto: CreateLessonDto) {
    const lesson = this.lessonRepository.create(createLessonDto);
    if (!lesson)
      throw new InternalServerErrorException('Lesson creation failed');
    await this.lessonRepository.save(lesson);
    return lesson;
  }

  async findAll() {
    return await this.lessonRepository.find();
  }

  async findOne(id: string) {
    const lesson = await this.lessonRepository.findOneBy({ id });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    let lesson = await this.findOne(id);
    lesson = { ...lesson, ...updateLessonDto };
    await this.lessonRepository.save(lesson);
    return lesson;
  }

  async remove(id: string) {
    const lesson = await this.findOne(id);
    await this.lessonRepository.remove(lesson);
    return lesson;
  }
}
