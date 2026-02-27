// src/auth/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

// 扩展 Request 接口，添加 user 属性
interface AuthRequest extends Request {
  user: JwtPayload;
}

/**
 * 自定义装饰器：从请求中提取当前用户信息
 * 使用方式：@CurrentUser() user: JwtPayload
 */
export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    // req.user 由 JwtStrategy.validate() 设置
    if (!request.user) return null;
    return data ? request.user[data] : request.user;
  },
);