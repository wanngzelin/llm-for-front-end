import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';
import { ResultData } from '@/common/model/response.model';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('用户模块')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Public()
  @ApiOperation({ summary: '注册' })
  @Post('register')
  async register(@Body() user: CreateUserDto): Promise<ResultData<User>> {
    return await this.userService.register(user)
  }

  @ApiOperation({ summary: '更新' })
  @Post('update')
  async update(@Body() user: UpdateUserDto): Promise<ResultData> {
    return await this.userService.update(user)
  }
}
