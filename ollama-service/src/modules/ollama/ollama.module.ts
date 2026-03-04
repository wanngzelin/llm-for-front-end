import { Module } from '@nestjs/common';
import { OllamaService } from './ollama.service';
import { OllamaController } from './ollama.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ConversationsModule } from '../conversations/conversations.module';
import { LangchainModule } from '../langchain/langchain.module';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        timeout: 1000 * 60 * 5,
        // baseURL: configService.get<string>('ollama.url'),
      }),
      inject: [ConfigService],
    }),
    ConversationsModule,
    LangchainModule
  ],
  providers: [OllamaService],
  controllers: [OllamaController]
})
export class OllamaModule { }
