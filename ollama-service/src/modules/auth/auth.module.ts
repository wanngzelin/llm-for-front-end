import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@/constants/jwtConstants';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({ secret: jwtConstants, signOptions: { expiresIn: '24h' } }),
    UserModule
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  // 3. 导出AuthService和JwtModule（供其他模块/全局使用）
  exports: [AuthService, JwtModule],
})
export class AuthModule { }
