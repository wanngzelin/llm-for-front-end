import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';

import configuration from '@/config/configuration'
import { UserModule } from '@/modules/user/user.module';
import { AuthService } from './modules/auth/auth.service';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwtConstants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('mysql.host'),
        port: configService.get<number>('mysql.port'),
        username: configService.get<string>('mysql.username'),
        password: configService.get<string>('mysql.password'),
        database: configService.get<string>('mysql.database'),
        charset: configService.get<string>('mysql.charset'),
        entities: [join(__dirname, 'modules/**/*.entity.{ts,js}'), join(__dirname, 'entities/**/*.entity.{ts,js}')],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
  ],
})
export class AppModule { }
