import { SetMetadata } from '@nestjs/common';

/**
 * 标记路由为公开，绕过全局 AuthGuard
 * 使用方式：@Public() @Get('login')
 */
export const Public = () => SetMetadata('isPublic', true);