import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { CommonEntity } from "@/common/entity/common.entity";
import { User } from "@/modules/user/user.entity";
import { Message } from "./message.entity";

@Entity('conversations')
export class Conversation extends CommonEntity {
  /**
   * 会话标题，默认值为'新对话'， 最大长度为255
   */
  @Column({
    type: 'varchar',
    length: 255,
    default: '新对话'
  })
  title: string;

  @ManyToOne(() => User, user => user.conversations)
  user: User;

  @Column('uuid')
  userId: string;

  @OneToMany(() => Message, message => message.conversation, {
    onDelete: 'CASCADE'
  })
  messages: Message[];
}