import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DatabaseService } from '../../src/database/database.service';
import { Task } from '../../src/tasks/task.entity';
import { TestUtils } from '../utils/index';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let testUtils: TestUtils;

  //MOCKS
  const tasks = require('../e2e/tasks.json');
  const tasksOpen = require('../e2e/tasksOpen.json');
  const tasksDone = require('../e2e/tasksDone.json');
  const badRequestStatus = require('../e2e/badRequestStatus.json');
  const badRequestEmpty = require('../e2e/badRequestEmpty.json');
  const taskById = require('../e2e/taskById.json');
  const notFoundById = require('../e2e/notFoundById.json');
  const badRequestCreateEmpty = require('../e2e/badRequestCreateEmpty.json');
  const badRequestCreateDesc = require('../e2e/badRequestCreateDesc.json');
  const badRequestCreateEmptyTitle = require('../e2e/badRequestCreateEmptyTitle.json');

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [DatabaseService, TestUtils],
    }).compile();

    // Load App
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    // Db connection to clean the Entity table
    testUtils = moduleFixture.get<TestUtils>(TestUtils);
    await testUtils.cleanAll(Task);

    // Start app
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  // Create
  // it('/tasks (POST)', () => {
  //   return request(app.getHttpServer())
  //     .post('/tasks')
  //     .send({ title: 'JIRA' })
  //     .expect(400)
  //     .expect(badRequestCreateDesc);
  // });

  // it('/tasks (POST)', () => {
  //   return request(app.getHttpServer())
  //     .post('/tasks')
  //     .send({ description: 'Training' })
  //     .expect(400)
  //     .expect(badRequestCreateEmptyTitle);
  // });

  // it('/tasks (POST)', async () => {
  //   const response = await request(app.getHttpServer())
  //     .post('/tasks')
  //     .send({ title: 'JIRA', description: 'Training' });

  //   expect(response.status).toEqual(201);
  //   expect(response.body).toMatchSnapshot({
  //     id: expect.any(String)
  //   })
  //   expect(response.body.title).toMatch('JIRA');
  //   expect(response.body.description).toMatch('Training');
  //   expect(response.body.status).toMatch('OPEN');
  // });

  // FindAll
  // it('/tasks (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/tasks')
  //     .expect(200)
  //     .expect(tasks);
  // });

  // it('/tasks?status=OPEN (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/tasks?status=OPEN')
  //     .expect(200)
  //     .expect(tasksOpen);
  // });

  // it('/tasks?status=DONE (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/tasks?status=DONE')
  //     .expect(200)
  //     .expect(tasksDone);
  // });

  // it('/tasks?search=test (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/tasks?search=test')
  //     .expect(200)
  //     .expect(tasksDone);
  // });

  // it('/tasks?status=whatever (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/tasks?status=whatever')
  //     .expect(400)
  //     .expect(badRequestStatus);
  // });

  // it('/tasks?search=whatever (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/tasks?search=whatever')
  //     .expect(200)
  //     .expect([]);
  // });

  // it('/tasks?search&status (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/tasks?search=&status=')
  //     .expect(400)
  //     .expect(badRequestEmpty);
  // });

  // FindById
  // it('/tasks/983b2d6e-771d-49ff-bfc5-0d677dcdabdb (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/tasks/983b2d6e-771d-49ff-bfc5-0d677dcdabdb')
  //     .expect(200)
  //     .expect(taskById);
  // });

  // it('/tasks/983b2d6e-771d-49ff-bfc5-0d677dcdabde (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/tasks/983b2d6e-771d-49ff-bfc5-0d677dcdabde')
  //     .expect(404)
  //     .expect(notFoundById);
  // });
});
