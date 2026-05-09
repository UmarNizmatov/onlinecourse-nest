import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './auth/entities/auth.entity';
import { ConfigModule } from '@nestjs/config';
import { CoursesModule } from './courses/courses.module';
import { ModulesModule } from './modules/modules.module';
import { ResultModule } from './result/result.module';
import { SubmissionModule } from './submission/submission.module';
import { AssigmentModule } from './assigment/assigment.module';
import { StudentCoursesModule } from './student_courses/student_courses.module';
import { LessonModule } from './lesson/lesson.module';
import { ModulesModule } from './modules/modules.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      port: +process.env.DB_PORT!,
      entities: [Auth],
      autoLoadEntities: true,
      synchronize: true,
    }),
    CoursesModule,
    ModulesModule,
    LessonModule,
    StudentCoursesModule,
    AssigmentModule,
    SubmissionModule,
    ResultModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
