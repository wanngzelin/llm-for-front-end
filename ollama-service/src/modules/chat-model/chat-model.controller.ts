import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ChatModelService } from './chat-model.service';
import { CreateChatModel, UpdateChatModel } from './dto/chat-model.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * 聊天模型控制器
 * 提供聊天模型的增删改查接口
 */
@ApiTags('聊天模型')
@Controller('chatModel')
export class ChatModelController {
  constructor(private readonly chatModelService: ChatModelService) { }

  /**
   * 创建聊天模型
   */
  @ApiOperation({ summary: '创建聊天模型' })
  @HttpCode(HttpStatus.OK)
  @Post('add')
  create(@Body() createChatModelDto: CreateChatModel, @CurrentUser('userName') userName: string) {
    return this.chatModelService.create(createChatModelDto, userName);
  }

  /**
   * 更新聊天模型
   */
  @ApiOperation({ summary: '更新聊天模型' })
  @HttpCode(HttpStatus.OK)
  @Post('update')
  update(@Body() updateChatModelDto: UpdateChatModel) {
    return this.chatModelService.update(updateChatModelDto);
  }

  /**
   * 获取用户的所有聊天模型
   */
  @ApiOperation({ summary: '获取用户的所有聊天模型' })
  @Get('findAll')
  findAll(@CurrentUser('userName') userName: string) {
    return this.chatModelService.findAll(userName);
  }

  /**
   * 删除聊天模型
   */
  @ApiOperation({ summary: '删除聊天模型' })
  @HttpCode(HttpStatus.OK)
  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.chatModelService.delete(id);
  }
}
