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
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { user_role } from 'src/auth/entities/role.enum';
import type { Request } from 'express';

@Controller('modules')
@UseGuards(JwtAccessGuard)
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post('/new')
  @UseGuards(RolesGuard)
  @Roles(user_role.admin, user_role.teacher)
  create(@Body() createModuleDto: CreateModuleDto) {
    return this.modulesService.create(createModuleDto);
  }

  @Get()
  findAll() {
    return this.modulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modulesService.findOne(id);
  }
  @Get(':moduleId/lessons')
  async findOneLessons(@Param('moduleId') id: string) {
    const data = await this.modulesService.findOne(id);
    return data.lessons;
  }
  @Post(':moduleId/assignment/:assignmentId')
  exam(
    @Body() assignmentDto: any,
    @Param('moduleId') id: string,
    @Req() req: Request,
    @Param('assignmentId') assignmentId: string,
  ) {
    return this.modulesService.exam(id, assignmentDto, req.user!.id);
  }

  @Patch(':id')
  @Roles(user_role.admin, user_role.teacher)
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.modulesService.update(id, updateModuleDto);
  }

  @Delete(':id')
  @Roles(user_role.admin, user_role.teacher)
  remove(@Param('id') id: string) {
    return this.modulesService.remove(id);
  }
}
