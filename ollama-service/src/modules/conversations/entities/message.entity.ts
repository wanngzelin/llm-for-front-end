
import { Column, Entity, ManyToOne } from "typeorm";
import { CommonEntity } from "@/common/entity/common.entity";
import { AIROLE } from "@/constants/constant.enum";
import { Conversation } from "./conversation.entity";

@Entity('messages')
export class Message extends CommonEntity {
  /**
   * 消息内容，最大长度为2048
   */
  @Column('text')
  content: string;

  @Column('text', { nullable: true })
  think: string;

  @Column('tinyint', { name: 'think_duration', default: 3 })
  thinkDuration: number;

  @ManyToOne(() => Conversation, conv => conv.messages, {
    onDelete: 'CASCADE'
  })
  conversation: Conversation;

  @Column()
  conversationId: string;

  /**
   * 消息角色，默认值为user
   */
  @Column({
    type: 'enum',
    enum: AIROLE,
    default: AIROLE.USER,
  })
  role: AIROLE;
}