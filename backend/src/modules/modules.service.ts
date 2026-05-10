import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Module } from './entities/module.entity';
import { Submission } from 'src/submission/entities/submission.entity';
import { Assignment } from 'src/assigment/entities/assigment.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Result } from 'src/result/entities/result.entity';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module) private readonly moduleRepo: Repository<Module>,
    @InjectRepository(Submission) private readonly submissionRepo: Repository<Submission>,
    @InjectRepository(Assignment) private readonly assignmentRepo: Repository<Assignment>,
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Result) private readonly resultRepo: Repository<Result>,
  ) {}

  async create(createModuleDto: CreateModuleDto) {
    const course = await this.courseRepo.findOneBy({ id: createModuleDto.courseId });
    if (!course) throw new NotFoundException(`Course #${createModuleDto.courseId} not found`);
    
    const module = this.moduleRepo.create({
      title: createModuleDto.title,
      course,
    });
    if (!module)
      throw new InternalServerErrorException('Module creation failed');
    await this.moduleRepo.save(module);
    return module;
  }

  async findAll(userId: string, role: string) {
    if (role === 'teacher') {
      return this.moduleRepo.find({
        where: { course: { teacher: { id: userId } } },
        relations: ['course'],
      });
    }
    return this.moduleRepo.find({ relations: ['course'] });
  }

  async findOne(id: string) {
    const module = await this.moduleRepo.findOne({
      where: { id },
      relations: ['lessons', 'assignments'],
    });
    if (!module) throw new NotFoundException(`Module #${id} not found`);
    return module;
  }

  async update(id: string, updateModuleDto: UpdateModuleDto) {
    let module = await this.findOne(id);
    module = { ...module, ...updateModuleDto };
    await this.moduleRepo.save(module);
    return module;
  }

  async remove(id: string) {
    const module = await this.findOne(id);
    await this.moduleRepo.remove(module);
    return { message: `Module #${id} deleted successfully` };
  }

  async submitAssignment(moduleId: string, userId: string, content?: string) {
    const assignment = await this.assignmentRepo.findOne({
      where: { module: { id: moduleId } },
      relations: ['module', 'module.course'],
    });
    if (!assignment)
      throw new NotFoundException(`No assignment found for module #${moduleId}`);
    const user = await this.authRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');
    const submission = this.submissionRepo.create({ assignment, user, content });
    await this.submissionRepo.save(submission);

    const course = assignment.module.course;
    const existingResult = await this.resultRepo.findOne({
      where: { user: { id: userId }, course: { id: course.id } },
    });
    if (!existingResult) {
      const result = this.resultRepo.create({ user, course, totalScore: 0 });
      await this.resultRepo.save(result);
    }

    return submission;
  }
}
