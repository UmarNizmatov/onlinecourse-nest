import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { loginAuthDto } from './dto/login-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
    private readonly jwtService: JwtService,
  ) {}
  async register(createAuthDto: CreateAuthDto) {
    const userwithsameemail = await this.findwithEmail(createAuthDto.email);
    if (userwithsameemail)
      throw new BadRequestException('This email is already registered');
    createAuthDto.password = await bcrypt.hash(createAuthDto.password, 12);
    const user = this.authRepo.create(createAuthDto);
    await this.authRepo.save(user);
    user.password = '';
    return user;
  }
  async login(loginAuthDto: loginAuthDto) {
    const user = await this.findwithEmail(loginAuthDto.email, true);
    if (!user) throw new BadRequestException('Email or password is wrong');
    const isMatch = await bcrypt.compare(loginAuthDto.password, user.password);
    if (!isMatch) throw new BadRequestException('Email or password is wrong');
    const payload = { id: user.id, role: user.role };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET_KEY,
      expiresIn: '7d',
    });
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET_KEY,
      expiresIn: '35m',
    });
    return {
      refreshToken,
      accessToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }
  async findwithEmail(email: string, withPassword = false) {
    if (withPassword) {
      return this.authRepo
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.email = :email', { email })
        .getOne();
    }

    return this.authRepo.findOne({ where: { email } });
  }

  async refresh(user: Auth) {
    const payload = { id: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET_KEY,
      expiresIn: '35m',
    });
    return accessToken;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
