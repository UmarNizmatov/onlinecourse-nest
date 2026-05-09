import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { user_role } from 'src/auth/entities/role.enum';

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
