import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModelService } from './chat-model.service';
import { ChatModelController } from './chat-model.controller';
import { ChatModel } from './chat-model.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatModel]),UserModule],
  providers: [ChatModelService],
  controllers: [ChatModelController]
})
export class ChatModelModule {}
