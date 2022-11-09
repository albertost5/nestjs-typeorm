import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService: TasksService;

  const TASK_REPOSITORY_TOKEN = getRepositoryToken(Task);

  // MOCKS
  const createTaskMock = require('../../test/controllers/createTask.json');
  const getTasksMock = require('../../test/controllers/getTasks.json');
  const updateTaskStatusMock = require('../../test/controllers/updateTaskStatus.json');
  const deleteTaskMock = require('../../test/controllers/deleteTask.json');

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        {
          provide: TASK_REPOSITORY_TOKEN,
          useValue: {
            createTask: jest.fn().mockReturnThis(),
            getTaskById: jest.fn().mockReturnThis(),
            getTasks: jest.fn().mockReturnThis(),
            deleteTask: jest.fn().mockReturnThis(),
            updateTaskStatus: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    tasksService = moduleRef.get<TasksService>(TasksService);
    tasksController = moduleRef.get<TasksController>(TasksController);
  });

  describe('TasksController', () => {
    it('1. controller should be defined.', () => {
      expect(tasksController).toBeDefined();
    });

    it('2. service should be defined.', () => {
      expect(tasksService).toBeDefined();
    });
  });

  describe('getTasks:', () => {
    it('1. should return an array of tasks with no filters', async () => {
      jest.spyOn(tasksService, 'getTasks').mockResolvedValue(getTasksMock);
      const tasks = await tasksController.getTasks({});

      expect(tasksService.getTasks).toHaveBeenCalledWith({});
      expect(tasks).toBe(getTasksMock);
    });

    it('2. should return an array of tasks filtered by status: OPEN', async () => {
      jest.spyOn(tasksService, 'getTasks').mockResolvedValue(getTasksMock);
      const tasks = await tasksController.getTasks({ status: TaskStatus.OPEN });

      expect(tasksService.getTasks).toHaveBeenCalledWith({
        status: TaskStatus.OPEN,
      });
      expect(tasks).toBe(getTasksMock);
    });

    it('3. should return an array of tasks filtered by search: JS', async () => {
      jest.spyOn(tasksService, 'getTasks').mockResolvedValue(getTasksMock);
      const tasks = await tasksController.getTasks({ search: 'JS' });

      expect(tasksService.getTasks).toHaveBeenCalledWith({ search: 'JS' });
      expect(tasks).toBe(getTasksMock);
    });

    it('4. should return an array of tasks filtered by status: OPEN and search: JS', async () => {
      jest.spyOn(tasksService, 'getTasks').mockResolvedValue(getTasksMock);
      const tasks = await tasksController.getTasks({
        status: TaskStatus.OPEN,
        search: 'JS',
      });

      expect(tasksService.getTasks).toHaveBeenCalledWith({
        status: TaskStatus.OPEN,
        search: 'JS',
      });
      expect(tasks).toBe(getTasksMock);
    });
  });

  describe('getTaskById:', () => {
    const taskId: string = 'ebfe3d39-def1-42a7-99fe-340e22b0abd3';

    it('1. should return a task found by id', async () => {
      jest.spyOn(tasksService, 'getTaskById').mockResolvedValue(createTaskMock);
      const task = await tasksController.getTaskById(taskId);

      expect(tasksService.getTaskById).toHaveBeenCalledWith(taskId);
      expect(task).toBe(createTaskMock);
    });
  });

  describe('deleteTask:', () => {
    const taskId: string = 'ebfe3d39-def1-42a7-99fe-340e22b0abd3';

    it('1. should return an object with a OK message', async () => {
      jest.spyOn(tasksService, 'deleteTask').mockResolvedValue(deleteTaskMock);
      const taskDeleted = await tasksService.deleteTask(taskId);

      expect(tasksService.deleteTask).toHaveBeenCalledWith(taskId);
      expect(taskDeleted).toBe(deleteTaskMock);
    });
  });

  describe('updateTaskStatus:', () => {
    const taskId: string = 'ebfe3d39-def1-42a7-99fe-340e22b0abd3';

    it('1. should return a task with the status updated', async () => {
      jest
        .spyOn(tasksService, 'updateTaskStatus')
        .mockResolvedValue(updateTaskStatusMock);
      const taskUpdated = await tasksService.updateTaskStatus(taskId, {
        status: TaskStatus.DONE,
      });

      expect(tasksService.updateTaskStatus).toHaveBeenCalledWith(taskId, {
        status: TaskStatus.DONE,
      });
      expect(taskUpdated).toBe(updateTaskStatusMock);
    });
  });

  describe('createTask:', () => {
    it('1. should return a new task', async () => {
      jest.spyOn(tasksService, 'createTask').mockResolvedValue(createTaskMock);
      const newTask = await tasksService.createTask({
        title: 'Test title',
        description: 'Test description',
      });

      expect(tasksService.createTask).toHaveBeenCalledWith({
        title: 'Test title',
        description: 'Test description',
      });
      expect(newTask).toBe(createTaskMock);
    });
  });
});
