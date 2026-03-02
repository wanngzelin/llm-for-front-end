import { type BubbleItemType } from "@ant-design/x";

export interface IMsg extends BubbleItemType {
  /** 会话ID */
  conversationId: string;
  /** AI 思考记录 */
  think?: string;
  /** 思考是否完成 */
  thinkDone?: boolean;
  /** 思考用时 */
  thinkDuration?: string;
}

export interface IConversation { title: string; id: string }