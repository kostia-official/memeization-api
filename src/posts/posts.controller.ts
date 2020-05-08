import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './posts.entity';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() post: Partial<PostEntity>, @Request() req) {
    const { id } = req.user;

    return this.postsService.create({ ...post, userId: id });
  }

  @Get()
  async findAll() {
    return this.postsService.findAll();
  }
}
