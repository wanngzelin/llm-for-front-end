import { jwtConstants } from "@/constants/jwtConstants";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 从请求头的 Authorization 中提取 Bearer Token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 不忽略过期时间，让 Passport 自动校验
      ignoreExpiration: false,
      // 从环境变量获取 JWT 密钥
      secretOrKey: jwtConstants,
    });
  }

  // JWT 验证通过后，解析 payload 并返回用户信息
  async validate(payload: JwtPayload) {
    // 这里可以根据 payload 中的 userId 查询数据库，返回完整用户信息
    // 为了演示，我们直接返回 payload 中的数据
    return payload;
  }
}