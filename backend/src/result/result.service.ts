import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from './entities/result.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { Course } from 'src/courses/entities/course.entity';
import { CreateResultDto } from './dto/create-result.dto';

@Injectable()
export class ResultService {
  constructor(
    @InjectRepository(Result) private readonly resultRepo: Repository<Result>,
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
  ) {}

  async create(userId: string, createResultDto: CreateResultDto): Promise<Result> {
    const user = await this.authRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');
    const course = await this.courseRepo.findOneBy({ id: createResultDto.courseId });
    if (!course) throw new NotFoundException('Course not found');
    const result = this.resultRepo.create({
      user,
      course,
      totalScore: createResultDto.totalScore,
    });
    return this.resultRepo.save(result);
  }

  async findAllByUser(userId: string): Promise<Result[]> {
    return this.resultRepo.find({
      where: { user: { id: userId } },
      relations: ['course'],
    });
  }
}
