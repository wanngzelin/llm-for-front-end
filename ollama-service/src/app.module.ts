import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';

import configuration from '@/config/configuration'
import { UserModule } from '@/modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModelModule } from './modules/chat-model/chat-model.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { OllamaModule } from './modules/ollama/ollama.module';
import { AllExceptionsFilter } from './common/filter/http-exception.filter';

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
        timezone: configService.get<string>('mysql.timezone'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    ChatModelModule,
    ConversationsModule,
    OllamaModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    }
  ],
  controllers: [],
})
export class AppModule { }
