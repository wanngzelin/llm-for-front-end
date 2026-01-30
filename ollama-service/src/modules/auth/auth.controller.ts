import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidateUser } from './auth.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: '登录' })
  async login(@Body() user: ValidateUser) {
    return this.authService.validateUser(user)
  }
}
