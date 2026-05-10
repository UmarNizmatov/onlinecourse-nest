import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission, SubmissionStatus } from './entities/submission.entity';
import { Auth } from 'src/auth/entities/auth.entity';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepo: Repository<Submission>,
    @InjectRepository(Auth)
    private authRepo: Repository<Auth>,
  ) {}
  async create(
    createSubmissionDto: CreateSubmissionDto,
    userId: string,
    file: Express.Multer.File,
  ) {
    const user = await this.authRepo.findOneBy({ id: userId });
    if (!user) throw new BadRequestException('User not found');
    const submission = this.submissionRepo.create({
      ...createSubmissionDto,
      user: user,
      fileUrl: file?.path ?? undefined,
    });
    await this.submissionRepo.save(submission);
    return submission;
  }

  findAll() {
    const data = this.submissionRepo.find({
      relations: ['user', 'assignment'],
    });
    return data;
  }

  findOne(id: string) {
    const data = this.submissionRepo.findOneBy({ id });
    return data;
  }
  findUserSubmissions(userId: string) {
    const data = this.submissionRepo.find({
      where: { user: { id: userId } },
      relations: ['user', 'assignment'],
    });
    return data;
  }
  async checkSubmission(id: string, score: number) {
    const submission = await this.submissionRepo.findOne({ where: { id }, relations: ['assignment'] });
    if (!submission) throw new BadRequestException('Submission not found');
    const assignment = submission.assignment;
    if (!assignment) throw new BadRequestException('Assignment not found');
    if (score < 0 || score > assignment.maxScore) {
      throw new BadRequestException(
        `Score must be between 0 and ${assignment.maxScore}`,
      );
    }
    submission.score = score;
    submission.status = SubmissionStatus.checked;
    await this.submissionRepo.save(submission);
    return submission;
  }

  update(id: string, updateSubmissionDto: UpdateSubmissionDto) {
    return `This action updates a #${id} submission`;
  }

  remove(id: string) {
    return `This action removes a #${id} submission`;
  }
}
