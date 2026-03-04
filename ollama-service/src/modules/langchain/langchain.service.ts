import { Injectable } from '@nestjs/common';
import { ChatOllama } from '@langchain/ollama';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';


@Injectable()
export class LangchainService {
  private baseUrl = 'http://localhost:11434';


  /** 创建一个ollama模型 */
  createChatModel(model: string, temperature = 0.6, topP = 0.6, think = true): ChatOllama {
    return new ChatOllama({
      // baseUrl: this.baseUrl,
      model,
      temperature,
      topP,
      think
    })
  }
}
