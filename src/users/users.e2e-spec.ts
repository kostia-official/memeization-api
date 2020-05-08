import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as faker from 'faker';
import { AppModule } from '../app.module';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([User])],
      providers: [UsersService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    usersService = moduleFixture.get<UsersService>(UsersService);
  });

  describe('POST /users', () => {
    const user: Partial<User> = {
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.random.uuid(),
    };

    it('should create a user', () => {
      const { password, ...userWithoutPassword } = user;

      return request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(201)
        .expect(({ body }) => {
          expect(body.id).toBeTruthy();
          expect(body).toMatchObject(userWithoutPassword);

          expect(body.password).not.toBe(user.password);
        });
    });
  });

  describe('GET /users/:id', () => {
    const user: Partial<User> = {
      id: faker.random.uuid(),
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.random.uuid(),
    };

    let accessToken;
    beforeAll(async () => {
      const result = await request(app.getHttpServer())
        .post('/signup')
        .send(user);

      accessToken = result.body.accessToken;
    });

    it('should return a user', () => {
      const { password, ...userWithoutPassword } = user;

      return request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect(req => {
          expect(req.body).toMatchObject(userWithoutPassword);
        });
    });
  });

  describe('GET /users/me', () => {
    const user: Partial<User> = {
      id: faker.random.uuid(),
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.random.uuid(),
    };

    let accessToken;
    beforeAll(async () => {
      const result = await request(app.getHttpServer())
        .post('/signup')
        .send(user);

      accessToken = result.body.accessToken;
    });

    it('should return a user', () => {
      const { password, ...userWithoutPassword } = user;

      return request(app.getHttpServer())
        .get(`/users/me`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect(req => {
          expect(req.body).toMatchObject(userWithoutPassword);
        });
    });
  });
});
