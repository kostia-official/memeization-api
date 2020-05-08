import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as faker from 'faker';
import { AppModule } from '../app.module';
import { PostsService } from './posts.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts.entity';
import { AuthService } from '../auth/auth.service';

describe('Posts (e2e)', () => {
  let app: INestApplication;
  let postsService: PostsService;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([User, Post])],
      providers: [PostsService, UsersService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    postsService = moduleFixture.get<PostsService>(PostsService);
    authService = moduleFixture.get<AuthService>(AuthService);
  });

  describe('POST /posts', () => {
    const user: Partial<User> = {
      id: faker.random.uuid(),
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.random.uuid(),
    };

    const post: Partial<Post> = {
      imageUrl: faker.random.uuid(),
      likes: []
    };

    let accessToken;
    beforeAll(async() => {
      const result = await authService.signUp(user);
      accessToken = result.accessToken;
    });

    it('should create a post', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .send(post)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201)
        .expect(({ body }) => {
          expect(body.id).toBeTruthy();
          expect(body).toMatchObject(post);
        });
    });
  });
});
