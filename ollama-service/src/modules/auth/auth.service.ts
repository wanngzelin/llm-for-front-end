import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from '../user/user.service';
import { ValidateUser } from './auth.dto';
import { User } from '../user/user.entity';
import { STATUS } from '@/constants/constant.enum';
import { ResultData } from '@/common/model/response.model';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  // 验证用户（本地登录时调用）
  async validateUser(userInfo: ValidateUser) {
    const user = await this.userService.findOne(userInfo.userName)
    if (!user) return ResultData.fail(HttpStatus.NOT_FOUND, '用户不存在')
    if (user.status !== STATUS.NORMAL) return ResultData.fail(HttpStatus.FORBIDDEN, '用户已被禁用')
    if (!bcrypt.compareSync(userInfo.password, user.password)) return ResultData.fail(HttpStatus.FORBIDDEN, '密码错误')
    // 只有用户存在且是正常状态且密码正确才验证通过
    return await this.login(user)
  }

  // 生成 JWT 令牌
  async login(user: User) {
    const payload: JwtPayload = { userName: user.userName, sub: user.id };
    const data = {
      access_token: this.jwtService.sign(payload),
      user
    }
    return ResultData.success(data)
  }
}
