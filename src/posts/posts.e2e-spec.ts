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

describe('Posts (e2e)', () => {
  let app: INestApplication;
  let postsService: PostsService;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([User, Post])],
      providers: [PostsService, UsersService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    postsService = moduleFixture.get<PostsService>(PostsService);
    usersService = moduleFixture.get<UsersService>(UsersService);
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
      likes: [],
      userId: user.id,
    };

    beforeAll(() => {
      return usersService.create(user);
    });

    it('should create a post', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .send(post)
        .expect(201)
        .expect(({ body }) => {
          expect(body.id).toBeTruthy();
          expect(body).toMatchObject(post);
        });
    });
  });

  // describe('GET /users/:id', () => {
  //   const user: UserCreateInput = {
  //     id: faker.random.uuid(),
  //     name: faker.internet.userName(),
  //     email: faker.internet.email(),
  //     password: faker.random.uuid(),
  //   };
  //
  //   beforeAll(() => {
  //     return postsService.create(user);
  //   });
  //
  //   it('should create a user', () => {
  //     return request(app.getHttpServer())
  //       .get(`/users/${user.id}`)
  //       .expect(200)
  //       .expect(req => {
  //         expect(req.body).toMatchObject(user);
  //       });
  //   });
  // });
});
