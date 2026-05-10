import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module as ModuleEntity } from './entities/module.entity';
import { Submission } from 'src/submission/entities/submission.entity';
import { Assignment } from 'src/assigment/entities/assigment.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Enrollment } from 'src/student_courses/entities/enrollment.entity';
import { ModulesAccessGuard } from './modules-access.guard';
import { Result } from 'src/result/entities/result.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModuleEntity,
      Submission,
      Assignment,
      Auth,
      Course,
      Enrollment,
      Result,
    ]),
  ],
  controllers: [ModulesController],
  providers: [ModulesService, ModulesAccessGuard],
})
export class ModulesModule {}
