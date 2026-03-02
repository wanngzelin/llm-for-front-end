/** 流式数据LLama的返回数据 */
export interface ILLamaVo {
  created_at: string;
  done: boolean;
  message: {
    role: string, content?: string, thinking?: string;
  }
  model: string
}