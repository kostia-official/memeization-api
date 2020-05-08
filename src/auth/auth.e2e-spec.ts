import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as faker from 'faker';
import { AppModule } from '../app.module';
import { User } from '../users/users.entity';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Authenticate - Sign Up', () => {
    const user: Partial<User> = {
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.random.uuid(),
    };

    it('should sign up a user', () => {
      const { password, ...userWithoutPassword } = user;

      return request(app.getHttpServer())
        .post('/signup')
        .send(user)
        .expect(201)
        .expect(({ body }) => {
          expect(body.accessToken).toBeTruthy();

          expect(body.user).toMatchObject(userWithoutPassword);
          expect(body.user.password).toBeUndefined();
        });
    });
  });

  describe('Authenticate - Sign In', () => {
    const user: Partial<User> = {
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.random.uuid(),
    };

    beforeAll(() => {
      return request(app.getHttpServer())
        .post('/signup')
        .send(user);
    });

    it('should sign up a user', () => {
      const { password, ...userWithoutPassword } = user;

      return request(app.getHttpServer())
        .post('/signin')
        .send(user)
        .expect(201)
        .expect(({ body }) => {
          expect(body.accessToken).toBeTruthy();

          expect(body.user).toMatchObject(userWithoutPassword);
          expect(body.user.password).toBeUndefined();
        });
    });
  });

  describe('Authorize', () => {
    const user: Partial<User> = {
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

    it('should respond with the current user', () => {
      const { password, ...userWithoutPassword } = user;

      return request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toMatchObject(userWithoutPassword);
          expect(body.password).toBeUndefined();
        });
    });
  });
});
