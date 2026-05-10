import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { user_role } from 'src/auth/entities/role.enum';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import 'multer';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(user_role.admin, user_role.teacher)
  @UseInterceptors(
    FileInterceptor('video', {
      limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('video/')) {
          return cb(
            new BadRequestException('Можно загружать только видео'),
            false,
          );
        }

        cb(null, true);
      },
    }),
  )
  create(
    @Body() createLessonDto: CreateLessonDto,
    @UploadedFile() video: Express.Multer.File,
  ) {
    return this.lessonService.create({
      ...createLessonDto,
      videoUrl: video?.path,
    });
  }

  @Get()
  findAll() {
    return this.lessonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(user_role.admin, user_role.teacher)
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonService.update(id, updateLessonDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(user_role.admin, user_role.teacher)
  remove(@Param('id') id: string) {
    return this.lessonService.remove(id);
  }
}
