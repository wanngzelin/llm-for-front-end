import { type BubbleItemType } from "@ant-design/x";

export interface IMsg extends BubbleItemType { conversationId: string }

export interface IConversation { title: string; id: string }