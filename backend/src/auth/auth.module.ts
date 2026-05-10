import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { JwtAccessGuard } from './jwt-access.guard';
import { AuthRefreshTokenGuard } from './authrefreshToken.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Auth]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessGuard, AuthRefreshTokenGuard],
  exports: [JwtModule, TypeOrmModule, JwtAccessGuard, AuthRefreshTokenGuard],
})
export class AuthModule {}
