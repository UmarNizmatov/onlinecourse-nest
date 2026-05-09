import { Module } from '@nestjs/common';
import { AssigmentService } from './assigment.service';
import { AssigmentController } from './assigment.controller';

@Module({
  controllers: [AssigmentController],
  providers: [AssigmentService],
})
export class AssigmentModule {}
