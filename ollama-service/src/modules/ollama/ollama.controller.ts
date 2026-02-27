import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { OllamaService } from './ollama.service';
import { SendMessageDto } from '../conversations/dto/message.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
}
