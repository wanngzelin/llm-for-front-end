import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { IterableReadableStream } from '@langchain/core/utils/stream';

import { ResultData } from '@/common/model/response.model';
import { SendMessageDto } from '../conversations/dto/message.dto';
import { ConversationsService } from '../conversations/conversations.service';
import { AIROLE } from '@/constants/constant.enum';
import { LangchainService } from '../langchain/langchain.service';
import { ChatStreamDto } from './dto/chat-stream.dto';
import { MessageStructure, MessageToolSet, AIMessageChunk } from '@langchain/core/messages';
import { LLMStreamChunkVO } from './vo/llm-stream-chunk';

@Injectable()
export class OllamaService {
  private readonly ollamaUrl = 'http://localhost:11434/api/chat';
  // private readonly modelName = 'qwen3:0.6b';
  private readonly modelName = 'deepseek-r1:8b';

  constructor(
    private readonly httpService: HttpService,
    private readonly conversationsService: ConversationsService,
    private readonly langchainService: LangchainService,
  ) { }

  async chat(sendMessageDto: SendMessageDto): Promise<ResultData<{ role: AIROLE, content: string } | null>> {
    if (!sendMessageDto.conversationId) return ResultData.fail(HttpStatus.BAD_REQUEST, '会话不存在')
    const { data: messageList } = await this.conversationsService.findMsgByConversationId(sendMessageDto.conversationId)
    const { data } = await firstValueFrom<{ data: { message: { role: AIROLE, content: string } } }>(
      this.httpService.post(this.ollamaUrl, {
        model: this.modelName,
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
  // async streamChat(sendMessageDto: SendMessageDto, signal?: AbortSignal): Promise<Readable> {
  //   // 构建Ollama请求体（单轮仅传当前消息）
  //   const requestBody = {
  //     model: this.modelName,
  //     messages: [sendMessageDto], // 单轮无历史
  //     stream: true, // 强制开启流式返回
  //   };
  //   try {
  //     const response = await this.httpService.axiosRef.post(this.ollamaUrl, requestBody, { responseType: 'stream', signal })
  //     return response.data
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  async streamChat(chatStreamDto: ChatStreamDto) {
    const { message, modelConfig } = chatStreamDto;
    const { role, content } = message;
    const { model, think, topP, temperature } = modelConfig;
    const AIModel = this.langchainService.createChatModel(model, temperature, topP, think);
    const stream = await AIModel.stream([{ role, content }]);
    return this.extracTextStream(stream);
  }

  private async *extracTextStream(stream: IterableReadableStream<AIMessageChunk<MessageStructure<MessageToolSet>>>): AsyncIterable<string> {
    for await (const chunk of stream) {
      const msg = this.formatChunk(chunk);
      yield JSON.stringify(msg)
    }
  }

  private formatChunk(chunk: AIMessageChunk<MessageStructure<MessageToolSet>>): LLMStreamChunkVO {
    const thinking = chunk.additional_kwargs?.reasoning_content as string || undefined;
    const content = typeof chunk.content === 'string' ? chunk.content : undefined;
    const done = typeof chunk.response_metadata === 'object'
      && chunk.response_metadata !== null
      && 'done' in chunk.response_metadata
      ? chunk.response_metadata.done as boolean
      : false
    const createAt = new Date()
    return { thinking, content, done, createAt }
  }
}
