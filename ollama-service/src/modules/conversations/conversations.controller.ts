import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateConversationDto } from './dto/conversation.dto';
import { ConversationsService } from './conversations.service';
import { SendMessageDto } from './dto/message.dto';

@ApiTags('会话/消息管理')
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationService: ConversationsService) { }

  @ApiOperation({ summary: '新增对话' })
  @HttpCode(HttpStatus.OK)
  @Post('add')
  async create(@Body() { title }: CreateConversationDto, @CurrentUser('sub') userId: string) {
    return await this.conversationService.create(userId, title)
  }

  @ApiOperation({ summary: '保存一条消息（用户或AI）' })
  @Post('saveMsg')
  @HttpCode(HttpStatus.OK)
  async saveMessage(@Body() createMsgDto: SendMessageDto) {
    return await this.conversationService.saveteMessage(createMsgDto)
  }

  @ApiOperation({ summary: '查询用户的所有会话' })
  @Get('findList')
  async findList(@CurrentUser('sub') userId: string) {
    return await this.conversationService.findList(userId)
  }

  @ApiOperation({ summary: '根据对话id查询对话的所有记录' })
  @HttpCode(HttpStatus.OK)
  @Get('findMsgByConversationId')
  async findMsgByConversationId(@Query('id') id: string) {
    return await this.conversationService.findMsgByConversationId(id)
  }

  @ApiOperation({ summary: '删除会话' })
  @Delete('delete/:id')
  async deleteConversation(@Param('id') id: string) {
    return await this.conversationService.deleteConversation(id)
  }
}
