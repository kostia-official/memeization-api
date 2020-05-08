import { Injectable } from '@nestjs/common';
import { Post } from './posts.entity';
import { Repository, FindConditions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  create(post: Partial<Post>): Promise<Post> {
    const postRecord = this.postsRepository.create(post);
    return this.postsRepository.save(postRecord);
  }

  findAll(where?: FindConditions<Post>): Promise<Post[]> {
    return this.postsRepository.find({ where });
  }

  findAllWithUser(where?: FindConditions<Post>): Promise<Post[]> {
    return this.postsRepository.find({ where, relations: ['user'] });
  }

  findAllWithLikedUsers(where?: FindConditions<Post>): Promise<Post[]> {
    return this.postsRepository.find({ where, relations: ['likedUsers'] });
  }
}
