import { Controller, Param, Request, Get, UseGuards, UseInterceptors, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { HidePasswordInterceptor } from '../common/hide-password.interceptor';
import { User } from './users.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UseInterceptors(HidePasswordInterceptor)
  async create(@Body() user: Partial<User>) {
    return this.usersService.create(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @UseInterceptors(HidePasswordInterceptor)
  async me(@Request() req) {
    const { id } = req.user;
    return this.usersService.findOne({ id });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @UseInterceptors(HidePasswordInterceptor)
  async get(@Param('id') id: string) {
    return this.usersService.findOne({ id });
  }
}
