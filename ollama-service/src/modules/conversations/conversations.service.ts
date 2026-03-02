import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { DataSource, Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { UserService } from '../user/user.service';
import { ResultData } from '@/common/model/response.model';
import { AIROLE } from '@/constants/constant.enum';
import { SendMessageDto, UpdateMsgDto } from './dto/message.dto';
import { UpdateConversationDto } from './dto/conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
    private dataSource: DataSource,
    private userService: UserService
  ) { }

  /**
   * 创建新会话
   */
  async create(userId: string, title = '新对话'): Promise<ResultData<Conversation | null>> {
    try {
      const conversation = this.conversationRepo.create({
        userId,
        title
      })
      const conversations = await this.conversationRepo.save(conversation)
      return ResultData.success(conversations)
    } catch (error) {
      console.log('err', error)
    }
  }

  /**
   * 更新会话标题
   * @param conversation 
   * @returns 
   */
  async update(conversation: UpdateConversationDto): Promise<ResultData<Conversation | null>> {
    if (!conversation.id) return ResultData.fail(HttpStatus.BAD_REQUEST, '修改数据不存在')
    const con = await this.conversationRepo.save(conversation)
    return ResultData.success(con)
  }

  /** 更新消息 */
  async updateMsg(msg: UpdateMsgDto) {
    if (!msg.id) return ResultData.fail(HttpStatus.BAD_REQUEST, '修改数据不存在')
    const con = await this.messageRepo.save(msg)
    return ResultData.success(con)
  }

  /**
   * 保存一条消息（用户或AI）
   */
  async saveMessage(msg: SendMessageDto): Promise<ResultData<Message | null>> {
    try {
      const conversation = await this.conversationRepo.findOneBy({ id: msg.conversationId })
      if (!conversation) return ResultData.fail(HttpStatus.NOT_FOUND, '会话不存在')
      const messageEntity = this.messageRepo.create(msg)
      const message = await this.messageRepo.save(messageEntity)
      return ResultData.success(message)
    } catch (error) {
      console.log('error', error)
    }
  }

  /**
   * 查询用户的所有会话
   * @param userId 用户id
   */
  async findList(userId: string) {
    const conversationList = await this.conversationRepo.find({
      where: { userId },
    })
    return ResultData.success(conversationList)
  }

  /**
   * 根据对话id查询对话的所有记录
   * @param conversationId 
   */
  async findMsgByConversationId(conversationId: string): Promise<ResultData<Message[] | null>> {
    const messageList = await this.messageRepo.find({
      where: { conversationId },
      order: { createdAt: 'ASC' }
    })
    return ResultData.success(messageList)
  }

  /**
   * 保存一次完成的AI对话
   * @param message SendMessageDto[]
   */
  async saveExchange(message: SendMessageDto[]) {
    try {
      const msgList = await this.messageRepo.save(message)
      return ResultData.success(msgList)
    } catch (error) {
      console.log('error', error)
    }
  }

  /**
   * 删除会话
   * @param id string
   */
  async deleteConversation(id: string) {
    const conversation = await this.conversationRepo.delete(id)
    if (conversation.affected > 0) return ResultData.success(null)
    return ResultData.fail(HttpStatus.BAD_REQUEST, '数据更新失败')
  }

  /** 删除消息 */
  async deleteMsg(id: string) {
    const msg = await this.messageRepo.delete(id)
    if (msg.affected > 0) return ResultData.success(null)
    return ResultData.fail(HttpStatus.BAD_REQUEST, '数据更新失败')
  }
}
