import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { AxiosError } from 'axios';
import { ResultData } from '@/common/model/response.model';
import { SendMessageDto } from '../conversations/dto/message.dto';
import { ConversationsService } from '../conversations/conversations.service';
import { AIROLE } from '@/constants/constant.enum';

@Injectable()
export class OllamaService {

  constructor(
    private readonly httpService: HttpService,
    private readonly conversationsService: ConversationsService,
  ) { }

  async chat(sendMessageDto: SendMessageDto): Promise<ResultData<{ role: AIROLE, content: string } | null>> {
    if (!sendMessageDto.conversationId) return ResultData.fail(HttpStatus.BAD_REQUEST, '会话不存在')
    const { data: messageList } = await this.conversationsService.findMsgByConversationId(sendMessageDto.conversationId)
    const { data } = await firstValueFrom<{ data: { message: { role: AIROLE, content: string } } }>(
      this.httpService.post('/api/chat', {
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
}
