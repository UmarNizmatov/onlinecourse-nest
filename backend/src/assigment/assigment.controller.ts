import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { AssigmentService } from './assigment.service';
import { CreateAssigmentDto } from './dto/create-assigment.dto';
import { UpdateAssigmentDto } from './dto/update-assigment.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { user_role } from 'src/auth/entities/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';


@Controller('assigment')
export class AssigmentController {
  constructor(private readonly assigmentService: AssigmentService) {}
  @Post(':moduleId/add_assignment')
  @UseGuards(RolesGuard)
  @Roles(user_role.admin, user_role.teacher)
  create(@Body() assignmentDto: any, @Param('moduleId') id: string) {
    return this.assigmentService.create(id, assignmentDto);
    
  }
  @Get('module/:moduleId')
  findByModule(@Param('moduleId') id: string) {
    return this.assigmentService.findByModule(id);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.assigmentService.findAll(req.user!.id, req.user!.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assigmentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAssigmentDto: UpdateAssigmentDto,
  ) {
    return this.assigmentService.update(id, updateAssigmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assigmentService.remove(id);
  }
}
