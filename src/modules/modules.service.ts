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

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module) private readonly moduleRepo: Repository<Module>,
    @InjectRepository(Submission) private readonly submissionRepo: Repository<Submission>,
    @InjectRepository(Assignment) private readonly assignmentRepo: Repository<Assignment>,
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
  ) {}

  async create(createModuleDto: CreateModuleDto) {
    const module = await this.moduleRepo.create(createModuleDto);
    if (!module)
      throw new InternalServerErrorException('Module creation failed');
    await this.moduleRepo.save(module);
    return module;
  }

  async findAll() {
    return await this.moduleRepo.find();
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
    });
    if (!assignment)
      throw new NotFoundException(`No assignment found for module #${moduleId}`);
    const user = await this.authRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');
    const submission = this.submissionRepo.create({ assignment, user, content });
    return this.submissionRepo.save(submission);
  }
}
