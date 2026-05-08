import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { user_role } from 'src/auth/entities/role.enum';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(user_role.admin)
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Put(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(user_role.admin)
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(user_role.admin)
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
