import { Column, Entity, ManyToOne } from "typeorm";
import { CommonEntity } from "@/common/entity/common.entity";
import { User } from "../user/user.entity";
import { STATUS } from "@/constants/constant.enum";

@Entity('chat_model')
export class ChatModel extends CommonEntity {

  /**
   * Ollama中的模型名，如"llama3.2:3b"
   */
  @Column('varchar', { name: 'model_name', comment: 'Ollama中的模型名', length: 64 })
  modelName: string;
  /**
   * 随机概率，温度越大，随机概率越大，默认0.7
   */
  @Column({ type: 'decimal', default: 0.7, nullable: true })
  temperature: number;

  /**
   * 最大上下文限制 1024
   */
  @Column({ default: 1024, nullable: true })
  maxTokens: number;

  /**
   * 描述，限制长度128
   */
  @Column('varchar', { name: 'descrition', comment: '描述', length: 128, nullable: true })
  descrition: string;

  /**
   * 是否为默认配置
   */
  @Column({ default: false })
  isDefault: boolean;

  /**
    * 状态:-1: 删除, 0: 正常, 1: 停用,默认值：0
    */
  @Column('tinyint', {
    name: 'status',
    comment: '-1 deleted, 0 normal, 1 deactivated',
    default: STATUS.NORMAL
  })
  status: STATUS;

  @ManyToOne(() => User, user => user.model)
  user: User; // 关联到用户

  constructor(partial: Partial<ChatModel>) {
    super();
    Object.assign(this, partial);
  }
}