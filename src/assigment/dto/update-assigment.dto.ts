import { PartialType } from '@nestjs/mapped-types';
import { CreateAssigmentDto } from './create-assigment.dto';

export class UpdateAssigmentDto extends PartialType(CreateAssigmentDto) {}
