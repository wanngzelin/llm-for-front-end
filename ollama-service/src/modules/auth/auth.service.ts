import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from '../user/user.service';
import { ValidateUser } from './auth.dto';
import { User } from '../user/user.entity';
import { STATUS } from '@/constants/constant.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  // 验证用户（本地登录时调用）
  async validateUser(userInfo: ValidateUser) {
    const user = await this.userService.findOne(userInfo.userName)
    // 只有用户存在且是正常状态且密码正确才验证通过
    if (user && user.status === STATUS.NORMAL && bcrypt.compareSync(userInfo.password, user.password)) {
      return await this.login(user)
    }
    return null
  }

  // 生成 JWT 令牌
  async login(user: User) {
    const payload = { username: user.userName, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user
    };
  }
}
