import { Controller, Post, Body, Get } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './posts.entity';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  create(@Body() post: Partial<PostEntity>) {
    return this.postsService.create(post);
  }

  @Get()
  async get() {
    return this.postsService.findAll();
  }
}
