import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { ResultData } from '@/common/model/response.model';
import { SendMessageDto } from '../conversations/dto/message.dto';
import { ConversationsService } from '../conversations/conversations.service';
import { AIROLE } from '@/constants/constant.enum';
import { Readable } from 'stream';

@Injectable()
export class OllamaService {
  private readonly ollamaUrl = 'http://localhost:11434/api/chat';

  constructor(
    private readonly httpService: HttpService,
    private readonly conversationsService: ConversationsService,
  ) { }

  async chat(sendMessageDto: SendMessageDto): Promise<ResultData<{ role: AIROLE, content: string } | null>> {
    if (!sendMessageDto.conversationId) return ResultData.fail(HttpStatus.BAD_REQUEST, '会话不存在')
    const { data: messageList } = await this.conversationsService.findMsgByConversationId(sendMessageDto.conversationId)
    const { data } = await firstValueFrom<{ data: { message: { role: AIROLE, content: string } } }>(
      this.httpService.post(this.ollamaUrl, {
        model: 'qwen3:0.6b',
        messages: [...messageList, sendMessageDto],
        stream: false,
      }).pipe(
        catchError((error: AxiosError) => {
          throw new HttpException('请求失败', 403);
        }),
      )
    );
    await this.conversationsService.saveExchange([sendMessageDto, { ...data.message, conversationId: sendMessageDto.conversationId }])
    return ResultData.success(data.message)
  }

  /**
   * 流式聊天处理
   * @param sendMessageDto 消息数据传输对象
   * @param res Express 响应对象
   */
  async streamChat(sendMessageDto: SendMessageDto, signal?: AbortSignal): Promise<Readable> {
    // 构建Ollama请求体（单轮仅传当前消息）
    const requestBody = {
      model: 'qwen3:0.6b',
      messages: [sendMessageDto], // 单轮无历史
      stream: true, // 强制开启流式返回
    };
    try {
      const response = await this.httpService.axiosRef.post(this.ollamaUrl, requestBody, { responseType: 'stream', signal })
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
}
