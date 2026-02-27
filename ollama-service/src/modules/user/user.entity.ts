/**
 * 用户实体类
 * 对应数据库表 sys_user
 */
import { STATUS } from "@/constants/constant.enum";
import { Exclude } from "class-transformer";
import { CommonEntity } from "@/common/entity/common.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { ChatModel } from "../chat-model/chat-model.entity";
import { Conversation } from "../conversations/entities/conversation.entity";

@Entity('sys_user')
export class User extends CommonEntity {
  /**
   * 用户名,长度限制：32个字符
   */
  @Column('varchar', { name: 'user_name', length: 32 })
  userName: string;

  /**
   * 头像URL,长度限制：128个字符
   */
  @Column('varchar', { name: 'avatar', length: 128, nullable: true })
  avatar?: string;

  /**
   * 密码,长度限制：32个字符,注意：存储时应进行加密处理
   */
  @Exclude()
  @Column('varchar', { name: 'password', length: 128 })
  password: string;

  /**
   * 状态:-1: 删除, 0: 正常, 1: 停用,默认值：0
   */
  @Column('tinyint', {
    name: 'status',
    comment: '-1 deleted, 0 normal, 1 deactivated',
    default: STATUS.NORMAL
  })
  status: STATUS;

  @OneToMany(() => ChatModel, (model) => model.user)
  model: ChatModel[]

  @OneToMany(() => Conversation, (conversation) => conversation.user)
  conversations: Conversation[];


  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
