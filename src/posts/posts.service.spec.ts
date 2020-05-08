import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { Post } from './posts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import * as faker from 'faker';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

describe('PostsService', () => {
  let postsService: PostsService;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([User, Post])],
      providers: [PostsService, UsersService],
    }).compile();

    postsService = moduleFixture.get<PostsService>(PostsService);
    usersService = moduleFixture.get<UsersService>(UsersService);
  });

  describe('Find posts', () => {
    const user: Partial<User> = {
      id: faker.random.uuid(),
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.random.uuid(),
    };

    const post: Partial<Post> = {
      imageUrl: faker.random.uuid(),
      likes: [user.id],
      userId: user.id,
    };

    beforeAll(async () => {
      await usersService.create(user);
      await postsService.create(post);
    });

    it('should get posts by userId', async () => {
      const posts = await postsService.findAll({ userId: user.id });

      expect(posts.length > 0).toBeTruthy();
      posts.map(post => {
        expect(post.userId).toBe(user.id);
        expect(post.user).toBeUndefined();
      });
    });

    it('should get posts with user by userId', async () => {
      const posts = await postsService.findAllWithUser({ userId: user.id });
      const { password, ...userWithoutPassword } = user;

      expect(posts.length > 0).toBeTruthy();
      posts.map(post => {
        expect(post.userId).toBe(user.id);
        expect(post.user).toMatchObject(userWithoutPassword);
      });
    });
  });
});
