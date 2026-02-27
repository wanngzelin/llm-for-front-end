import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatModel } from './chat-model.entity';
import { CreateChatModel } from './dto/chat-model.dto';
import { UpdateChatModel } from './dto/chat-model.dto';
import { UserService } from '../user/user.service';
import { ResultData } from '@/common/model/response.model';
import { id } from 'zod/v4/locales';
import { STATUS } from '@/constants/constant.enum';

/**
 * 聊天模型服务类
 * 提供聊天模型的增删改查操作
 */
@Injectable()
export class ChatModelService {
  constructor(
    @InjectRepository(ChatModel)
    private readonly chatModelRepository: Repository<ChatModel>,
    private readonly userService: UserService,
  ) { }
  /**
   * 创建聊天模型
   */
  async create(data: CreateChatModel, userName: string): Promise<ResultData<ChatModel | null>> {
    const user = await this.userService.findOne(userName);
    if (!user) return ResultData.fail(HttpStatus.NOT_FOUND, '用户不存在');
    const chatModel = this.chatModelRepository.create(data);
    chatModel.user = user;
    const result = await this.chatModelRepository.save(chatModel);
    if (result) return ResultData.success(result);
    return ResultData.fail(HttpStatus.BAD_REQUEST, '操作失败，请重新尝试');
  }

  /**
   * 更新聊天模型
   */
  async update(data: UpdateChatModel): Promise<ResultData<ChatModel | null>> {
    if (!data.id) return ResultData.fail(HttpStatus.BAD_REQUEST, '模型id为必传');
    const chatModel = await this.chatModelRepository.findOne({
      where: { id: data.id, status: STATUS.NORMAL },
    });
    if (!chatModel) return ResultData.fail(HttpStatus.NOT_FOUND, '聊天模型不存在');
    Object.assign(chatModel, data);
    const result = await this.chatModelRepository.save(chatModel);
    if (result) return ResultData.success(result);
    return ResultData.fail(HttpStatus.BAD_REQUEST, '操作失败，请重新尝试');
  }

  /**
   * 获取用户的所有聊天模型
   */
  async findAll(userName: string): Promise<ResultData<ChatModel[] | null>> {
    const user = await this.userService.findOne(userName);
    if (!user) return ResultData.fail(HttpStatus.NOT_FOUND, '用户不存在');
    const chatModels = await this.chatModelRepository.find({
      where: { user: { id: user.id }, status: STATUS.NORMAL },
      relations: ['user']
    });
    if (chatModels) return ResultData.success(chatModels);
    return ResultData.fail(HttpStatus.BAD_REQUEST, '操作失败，请重新尝试');
  }

  /**
   * 删除聊天模型
   */
  async delete(id: string): Promise<ResultData<ChatModel | null>> {
    const chatModel = await this.chatModelRepository.findOne({
      where: { id, status: STATUS.NORMAL },
    });
    if (!chatModel) return ResultData.fail(HttpStatus.NOT_FOUND, '聊天模型不存在');
    chatModel.status = STATUS.DELETED;
    const result = await this.chatModelRepository.save(chatModel);
    if (result) return ResultData.success(result);
    return ResultData.fail(HttpStatus.BAD_REQUEST, '操作失败，请重新尝试');
  }

  /**
   * 获取默认聊天模型
   */
}
