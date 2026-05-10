import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAssigmentDto } from './dto/create-assigment.dto';
import { UpdateAssigmentDto } from './dto/update-assigment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from './entities/assigment.entity';
import { Repository } from 'typeorm';
import { Module } from 'src/modules/entities/module.entity';

@Injectable()
export class AssigmentService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assigmentRepo: Repository<Assignment>,
    @InjectRepository(Module) private readonly moduleRepo: Repository<Module>,
  ) {}
  async create(moduleId: string, createAssigmentDto: CreateAssigmentDto) {
    const module = await this.moduleRepo.findOneBy({ id: moduleId });

    if (!module) throw new NotFoundException(`Module #${moduleId} not found`);
    const assigment = this.assigmentRepo.create({
      ...createAssigmentDto,
      module,
    });
    if (!assigment)
      throw new InternalServerErrorException(`Assigment creation failed`);
    await this.assigmentRepo.save(assigment);
    return assigment;
  }
  async findByModule(moduleId: string) {
    const module = await this.moduleRepo.findOneBy({ id: moduleId });
    if (!module) throw new NotFoundException(`Module #${moduleId} not found`);
    const data = await this.assigmentRepo.find({
      where: { module: module },
      relations: ['module'],
    });
    return data;
  }

  async findAll(userId: string, role: string) {
    if (role === 'teacher') {
      return this.assigmentRepo.find({
        where: { module: { course: { teacher: { id: userId } } } },
        relations: ['module', 'module.course'],
      });
    }
    return this.assigmentRepo.find();
  }

  async findOne(id: string) {
    const assigment = await this.assigmentRepo.findOneBy({ id });
    if (!assigment) throw new NotFoundException(`Assigment #${id} not found`);
    return assigment;
  }

  async update(id: string, updateAssigmentDto: UpdateAssigmentDto) {
    let assigment = await this.findOne(id);
    assigment = { ...assigment, ...updateAssigmentDto };
    await this.assigmentRepo.save(assigment);
    return assigment;
  }

  async remove(id: string) {
    const assigment = await this.findOne(id);
    await this.assigmentRepo.remove(assigment);
    return { message: `Assigment #${id} deleted successfully` };
  }
}
