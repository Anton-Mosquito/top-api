import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { disconnect } from 'mongoose';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { AppModule } from '../src/app.module';

const loginDto: AuthDto = {
  login: 'a@a.ua',
  password: '1'
}

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let access_token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - success', async (done) => {
    return request(app.getHttpServer())
    .post('/auth/login')
    .send(loginDto)
    .expect(200)
    .then(({body} : request.Response) => {
      access_token = body.access_token;
      expect(body.access_token).toBeDefined();
      done();
    })
  });

  it('/auth/login (POST) - fail password', async () => {
    return request(app.getHttpServer())
    .post('/auth/login')
    .send({...loginDto,password: '2'})
    .expect(401, {
      statusCode: 401,
      massage: "Wrong password",
      error: "Unauthorized"
    })
  });


  it('/auth/login (POST) - fail password', async () => {
    return request(app.getHttpServer())
    .post('/auth/login')
    .send({...loginDto, login: '2'})
    .expect(401, {
      statusCode: 401,
      massage: "User with this name can not be found",
      error: "Unauthorized"
    })
  });


  afterAll(() => {
    disconnect(); 
  })
});
