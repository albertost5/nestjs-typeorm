import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DatabaseService } from '../../src/database/database.service';
import { Task } from '../../src/tasks/task.entity';
import { TestUtils } from '../utils/index';

describe('Tasks (e2e)', () => {
  let app: INestApplication;
  let testUtils: TestUtils;

  let taskId_0: string;
  let taskId_1: string;

  //MOCKS
  const tasks = require('../e2e/tasks.json');
  const taskDone = require('../e2e/taskDone.json');
  const tasksFilterSearch = require('../e2e/tasksFilterSearch.json');
  const badRequestStatus = require('../e2e/badRequestStatus.json');
  const badRequestEmpty = require('../e2e/badRequestEmpty.json');
  const notFoundById = require('../e2e/notFoundById.json');
  const badRequestCreateEmpty = require('../e2e/badRequestCreateEmpty.json');
  const badRequestCreateDesc = require('../e2e/badRequestCreateDesc.json');
  const badRequestCreateEmptyTitle = require('../e2e/badRequestCreateEmptyTitle.json');
  const taskDeleted = require('../e2e/taskDeleted.json');

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

  // Create
  describe('createTask: ', () => {
    it('/tasks (POST), Error: the description is missing', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'JIRA' })
        .expect(400)
        .expect(badRequestCreateDesc);
    });
  
    it('/tasks (POST), Error: the title is missing', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({ description: 'Training' })
        .expect(400)
        .expect(badRequestCreateEmptyTitle);
    });

    it('/tasks (POST), Error: they body is missing', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({})
        .expect(400)
        .expect(badRequestCreateEmpty);
    });
  
    it('/tasks (POST), Create task', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'JIRA', description: 'Training' });
      
      taskId_0 = response.body.id;
      
      expect(response.status).toEqual(201);
      expect(response.body).toMatchSnapshot({
        id: expect.any(String)
      })
      expect(response.body.title).toMatch('JIRA');
      expect(response.body.description).toMatch('Training');
      expect(response.body.status).toMatch('OPEN');
    });
  })

  // Find
  describe('find:', () => {
    it('/tasks (GET), All tasks', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'NestJs', description: 'Training' });

      taskId_1 = response.body.id;
      
      // To match random ids
      tasks[0].id = taskId_0;
      tasks[1].id = taskId_1;

      return request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .expect(tasks);
    });

    it('/tasks?status=OPEN (GET), All tasks with status OPEN', () => {
      return request(app.getHttpServer())
        .get('/tasks?status=OPEN')
        .expect(200)
        .expect(tasks);
    });
  
    it('/tasks?status=DONE (GET), All tasks with status DONE', () => {
      return request(app.getHttpServer())
        .get('/tasks?status=DONE')
        .expect(200)
        .expect([]);
    });
  
    it('/tasks?search=js (GET), All tasks with "js" in the description', () => {
      
      tasksFilterSearch[0].id = taskId_1;

      return request(app.getHttpServer())
        .get('/tasks?search=js')
        .expect(200)
        .expect(tasksFilterSearch);
    });
  
    it('/tasks?status=whatever (GET), Error: no tasks with status "whatever"', () => {
      return request(app.getHttpServer())
        .get('/tasks?status=whatever')
        .expect(400)
        .expect(badRequestStatus);
    });
  
    it('/tasks?search=whatever (GET), Error: no tasks with "whatever" in the description', () => {
      return request(app.getHttpServer())
        .get('/tasks?search=whatever')
        .expect(200)
        .expect([]);
    });
  
    it('/tasks?search&status (GET), Error: status and search params are empty', () => {
      return request(app.getHttpServer())
        .get('/tasks?search=&status=')
        .expect(400)
        .expect(badRequestEmpty);
    });
  });


  // FindById
  describe('findById:', () => {
    it(`/tasks/:taskId (GET), Task by id`, () => {
      return request(app.getHttpServer())
        .get(`/tasks/${taskId_0}`)
        .expect(200)
        .expect(tasks[0]);
    });
  
    it('/tasks/:taskId (GET), Error: task with id not found', () => {
      return request(app.getHttpServer())
        .get('/tasks/983b2d6e-771d-49ff-bfc5-0d677dcdabde')
        .expect(404)
        .expect(notFoundById);
    });
  });

  // Update
  describe('updateTask:', () => {
    it('/tasks/:taskId/status (PATCH), Error: task with id not found', () => {
      return request(app.getHttpServer())
        .patch('/tasks/983b2d6e-771d-49ff-bfc5-0d677dcdabde/status')
        .send({ "status": "DONE" })
        .expect(404)
        .expect(notFoundById);
    });
    
    it('/tasks/:taskId/status (PATCH), Error: task with id not found', () => {
      return request(app.getHttpServer())
        .patch(`/tasks/${taskId_0}/status`)
        .send({ "status": "asdf" })
        .expect(400)
        .expect(badRequestStatus);
    });

    it('/tasks/:taskId/status (PATCH), Task updated', () => {
      taskDone.id = taskId_0;

      return request(app.getHttpServer())
        .patch(`/tasks/${taskId_0}/status`)
        .send({ "status": "DONE" })
        .expect(200)
        .expect(taskDone);
    });

    // Check that the update went well
    it('/tasks?status=DONE (GET), All tasks with status DONE', () => {
      return request(app.getHttpServer())
        .get('/tasks?status=DONE')
        .expect(200)
        .expect([taskDone]);
    });
  });

  // Delete
  describe('deleteTask', () => {
    it('/tasks/:taskId (DELETE), Error: task with id not found', () => {
      return request(app.getHttpServer())
        .delete('/tasks/983b2d6e-771d-49ff-bfc5-0d677dcdabde')
        .expect(404)
        .expect(notFoundById);
    });

    it('/tasks/:taskId (DELETE), Task deleted', () => {
      return request(app.getHttpServer())
        .delete(`/tasks/${taskId_1}`)
        .expect(200)
        .expect(taskDeleted);
    });

    // Check all tasks after deleting one
    it('/tasks (GET), All tasks after deleting one', async () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .expect([taskDone]);
    });
  });
});
