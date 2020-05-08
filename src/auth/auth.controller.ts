import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { LocalAuthGuard } from './local.guard';
import { AuthService } from './auth.service';
import { User } from '../users/users.entity';
import { HidePasswordInterceptor } from '../common/hide-password.interceptor';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseInterceptors(HidePasswordInterceptor)
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Request() req) {
    return this.authService.signIn(req.user);
  }

  @UseInterceptors(HidePasswordInterceptor)
  @Post('signup')
  async create(@Body() user: Partial<User>) {
    return this.authService.signUp(user);
  }
}
