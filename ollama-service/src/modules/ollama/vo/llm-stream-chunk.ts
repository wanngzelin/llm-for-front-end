/** llmama 模型返回数据格式统一 */
export interface LLMStreamChunkVO {
  /** 思考信息 */
  thinking?: string;
  /** 回复内容 */
  content?: string;
  /** 是否完成 */
  done: boolean;
  /** 创建时间 */
  createAt: Date;
}