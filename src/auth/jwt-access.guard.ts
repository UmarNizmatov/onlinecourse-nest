import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';

@Injectable()
export class JwtAccessGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization as string;
    if (!authHeader?.startsWith('Bearer '))
      throw new UnauthorizedException('Access token not found');

    const token = authHeader.split('Bearer ')[1];

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
