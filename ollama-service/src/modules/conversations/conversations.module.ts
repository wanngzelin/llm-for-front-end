import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Message]), UserModule],
  providers: [ConversationsService],
  controllers: [ConversationsController],
  exports: [ConversationsService]
})
export class ConversationsModule { }
