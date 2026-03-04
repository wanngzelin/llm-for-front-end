import { z } from 'zod'

export const AiResponseSchema = z.object({
  thinking: z.string().optional().describe('用AIMessage.additional_kwargs?.reasoning_conten字段填充thinking'),
  content: z.string().describe('AI 的核心回答内容（必填）'),
  done: z.boolean().optional().describe('是否为最后一个流式 chunk（默认 false）'),
});

export type AiResponse = z.infer<typeof AiResponseSchema>;