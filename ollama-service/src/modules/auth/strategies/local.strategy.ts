import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { UnauthorizedException } from "@nestjs/common";

export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'userName'
    })
  }

  async validate(userName: string, password: string) {
    console.log('调用了')
    const user = await this.authService.validateUser({ userName, password });
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    return user;
  }
}