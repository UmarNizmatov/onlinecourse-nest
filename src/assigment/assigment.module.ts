import { Module } from '@nestjs/common';
import { AssigmentService } from './assigment.service';
import { AssigmentController } from './assigment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from './entities/assigment.entity';
import { Module as ModuleEntity } from 'src/modules/entities/module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, ModuleEntity])],
  controllers: [AssigmentController],
  providers: [AssigmentService],
  exports: [AssigmentService],
})
export class AssigmentModule {}
