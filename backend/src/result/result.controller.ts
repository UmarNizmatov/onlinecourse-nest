import { Controller, Get, Req } from '@nestjs/common';
import { ResultService } from './result.service';
import type { Request } from 'express';

@Controller('results')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Get()
  findAll(@Req() req: Request) {
    return this.resultService.findAllByUser(req.user!.id);
  }
}
