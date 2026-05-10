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
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { user_role } from 'src/auth/entities/role.enum';
import { ModulesAccessGuard } from './modules-access.guard';
import type { Request } from 'express';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post('/new')
  @UseGuards(RolesGuard, ModulesAccessGuard)
  @Roles(user_role.admin, user_role.teacher)
  create(@Body() createModuleDto: CreateModuleDto) {
    return this.modulesService.create(createModuleDto);
  }

  @Post(':moduleId/assignment')
  @UseGuards(ModulesAccessGuard)
  submitAssignment(
    @Param('moduleId') moduleId: string,
    @Req() req: Request,
    @Body('content') content?: string,
  ) {
    return this.modulesService.submitAssignment(
      moduleId,
      req.user!.id,
      content,
    );
  }

  @Get()
  findAll() {
    return this.modulesService.findAll();
  }

  @Get(':id')
  @UseGuards(ModulesAccessGuard)
  findOne(@Param('id') id: string) {
    return this.modulesService.findOne(id);
  }

  @Get(':moduleId/lessons')
  @UseGuards(ModulesAccessGuard)
  async findOneLessons(@Param('moduleId') id: string) {
    const data = await this.modulesService.findOne(id);
    return data.lessons;
  }

  @Patch(':id')
  @UseGuards(ModulesAccessGuard)
  @Roles(user_role.admin, user_role.teacher)
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.modulesService.update(id, updateModuleDto);
  }

  @Delete(':id')
  @UseGuards(ModulesAccessGuard)
  @Roles(user_role.admin, user_role.teacher)
  remove(@Param('id') id: string) {
    return this.modulesService.remove(id);
  }
}
