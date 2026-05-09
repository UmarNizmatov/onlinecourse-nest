import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module as ModuleEntity } from './entities/module.entity';
import { Submission } from 'src/submission/entities/submission.entity';
import { Assignment } from 'src/assigment/entities/assigment.entity';
import { Auth } from 'src/auth/entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleEntity, Submission, Assignment, Auth])],
  controllers: [ModulesController],
  providers: [ModulesService],
})
export class ModulesModule {}
