import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { ResultData } from '@/common/model/response.model';
import { ValidateUser } from '../auth/auth.dto';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  /**
   * 注册
   * @param userInfo 
   * @returns 
   */
  async register(userInfo: CreateUserDto): Promise<ResultData<User | null>> {
    const user = await this.userRepository.findOneBy({ userName: userInfo.userName })
    if (user) return ResultData.fail(HttpStatus.BAD_REQUEST, '用户名重复');
    const newUser = this.userRepository.create(userInfo);
    newUser.password = bcrypt.hashSync(newUser.password, 10)
    const insertUser = await this.userRepository.save(newUser)
    return ResultData.success(insertUser)
  }

  /**
   * 
   * @param user 更新
   */
  async update(user: UpdateUserDto): Promise<ResultData<null>> {
    const { id } = user;
    const userInfo = await this.userRepository.findOneBy({ id })
    if (!userInfo) return ResultData.fail(HttpStatus.BAD_REQUEST, '未找到用户信息')
    const userAssign = Object.assign(user, userInfo)
    const upDate = await this.userRepository.save(userAssign)
    if (upDate) return ResultData.success()
    return ResultData.fail(HttpStatus.BAD_REQUEST, '用户信息更新失败')
  }

  /**
   * 
   * @param user 登录
   * @returns 
   */
  async login(user: ValidateUser): Promise<ResultData<User | null>> {
    const { userName, password } = user;
    const userInfo = await this.userRepository.findOneBy({ userName })
    if (!userInfo) return ResultData.fail(HttpStatus.BAD_REQUEST, '未找到用户信息')

    const isMatch = bcrypt.compareSync(password, userInfo.password)
    if (!isMatch) return ResultData.fail(HttpStatus.BAD_REQUEST, '密码不正确')

    if (userInfo.status === -1) return ResultData.fail(HttpStatus.BAD_REQUEST, '用户已停用')

    const updateUser = Object.assign(userInfo, { login_date: new Date().toISOString() })
    await this.userRepository.save(updateUser)
    if (updateUser) return ResultData.success(updateUser)
    ResultData.fail(HttpStatus.BAD_REQUEST, '操作失败，请重新尝试')
  }

  /**
   * 根据用户名查找用户
   * @param userName 
   * @returns 
   */
  async findOne(userName: string): Promise<User | null> {
    if (!userName) return null
    return await this.userRepository.findOneBy({ userName })
  }

  /**
   * 根据用户id查询用户
   */
  async findOneById(userId: string) {
    if (!userId) return null
    return await this.userRepository.findOneBy({ id: userId })
  }
}
