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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { RolesGuard } from 'src/auth/roles.guard';
import { user_role } from 'src/auth/entities/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 100 * 1024 * 1024, 
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('application/')) {
          return cb(
            new BadRequestException('Можно загружать только файлы'),
            false,
          );
        }

        cb(null, true);
      },
    }),
  )
  create(
    @Body() createSubmissionDto: CreateSubmissionDto,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.submissionService.create(createSubmissionDto, req.user!.id, file);
  }

  @Post(':id/check')
  @UseGuards(RolesGuard)
  @Roles(user_role.teacher)
  checkSubmission(@Param('id') id: string, @Body('score') score: number) {
    return this.submissionService.checkSubmission(id, score);
  }

  @Get()
  findAll() {
    return this.submissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submissionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubmissionDto: UpdateSubmissionDto) {
    return this.submissionService.update(id, updateSubmissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submissionService.remove(id);
  }
}
