import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';

@Injectable()
export class JwtAccessGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers?.authorization as string;
    if (!authHeader?.startsWith('Bearer '))
      throw new UnauthorizedException('Access token not found');

    const token = authHeader.slice(7);

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET_KEY,
      });

      const user = await this.authRepo.findOneBy({ id: payload.id });
      if (!user) throw new UnauthorizedException('User not found');

      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
