import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, Req, Res, Sse } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { OllamaService } from './ollama.service';
import { SendMessageDto } from '../conversations/dto/message.dto';
import { AIROLE } from '@/constants/constant.enum';

@ApiTags('Ollama')
@Controller('ollama')
export class OllamaController {
  constructor(private readonly ollamaService: OllamaService) { }

  @ApiOperation({ summary: 'Ollama 聊天' })
  @HttpCode(HttpStatus.OK)
  @Post('chat')
  async chat(@Body() sendMessageDto: SendMessageDto) {
    return this.ollamaService.chat(sendMessageDto);
  }

  @ApiOperation({ summary: 'stream接口' })
  @HttpCode(HttpStatus.OK)
  @Post('chatStream')
  async streamChat(@Body() sendMessageDto: SendMessageDto, @Res() res: Response, @Req() req: Request) {
    if (!sendMessageDto.conversationId) {
      throw new BadRequestException('会话不存在');
    }
    // 设置必要的响应头，确保流式输出不被缓存或压缩
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 创建 AbortController 用于取消请求
    const controller = new AbortController();
    const { signal } = controller;

    // 监听客户端断开连接，主动取消 Ollama 请求并销毁流
    req.on('close', () => {
      controller.abort()
    })

    try {
      // 获取ollama返回的可读流
      const ollamaStream = await this.ollamaService.streamChat(sendMessageDto, signal)

      // 将 Ollama 流通过管道转发给客户端
      ollamaStream.pipe(res);

      // 监听流事件
      ollamaStream.on('end', () => {
        res.end();
      });

      ollamaStream.on('error', (err) => {
        console.error('Stream error:', err);
        // 如果响应头尚未发送，可以发送错误状态；否则只能结束响应
        if (!res.headersSent) {
          res.status(500).send('Stream error');
        } else {
          res.end();
        }
      });

      // 额外处理：如果 axios 请求被取消（例如超时），流会触发 error
      signal.addEventListener('abort', () => {
        ollamaStream.destroy(); // 确保流被销毁
      });
    }
    catch (error) {
      console.log(error)
    }
  }
}
