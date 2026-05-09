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

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module) private readonly moduleRepo: Repository<Module>,
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
    const module = await this.moduleRepo.findOneBy({ id });
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
}
