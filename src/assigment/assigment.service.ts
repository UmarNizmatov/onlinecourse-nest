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
    const assigment = await this.assigmentRepo.create({
      ...createAssigmentDto,
      module,
    });
    if (!assigment)
      throw new InternalServerErrorException(`Assigment creation failed`);
    await this.assigmentRepo.save(assigment);
    return assigment;
  }
  async findByModule(moduleId: string) {
    const data = await this.assigmentRepo.find({
      where: { module: { id: moduleId } },
      relations: ['module'],
    });
    return data;
  }

  findAll() {
    return `This action returns all assigment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assigment`;
  }

  update(id: number, updateAssigmentDto: UpdateAssigmentDto) {
    return `This action updates a #${id} assigment`;
  }

  remove(id: number) {
    return `This action removes a #${id} assigment`;
  }
}
