import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  FindOneOptions,
  Repository
} from 'typeorm';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

describe('Test suite: tasks.service.ts', () => {
  let taskService: TasksService;
  let taskRepository: Repository<Task>;

  // MOCKS
  const createTaskDtoMock = require('../../test/service/createTaskDtoMock.json');
  const saveTaskMock = require('../../test/service/saveTaskMock.json');
  const deleteMock_0 = require('../../test/service/deleteMock_0.json');
  const deleteMock_1 = require('../../test/service/deleteMock_1.json');
  const deleteResMock = require('../../test/service/deleteResMock.json');

  const TASK_REPOSITORY_TOKEN = getRepositoryToken(Task);
  console.log({ TASK_REPOSITORY_TOKEN });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TASK_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn().mockReturnValue(createTaskDtoMock),
            // create: jest.fn().mockImplementation((dto: CreateTaskDto) => createTaskDtoMock)
            save: jest.fn().mockResolvedValue(saveTaskMock),
            findOne: jest.fn().mockResolvedValue(saveTaskMock),
            delete: jest.fn().mockResolvedValue(deleteMock_1),
          },
        },
      ],
    }).compile();

    taskService = module.get<TasksService>(TasksService);
    taskRepository = module.get<Repository<Task>>(TASK_REPOSITORY_TOKEN);
  });

  describe('TasksService.', () => {
    it('1. service should be defined.', () => {
      expect(taskService).toBeDefined();
    });

    it('2. task repository should be defined.', () => {
      expect(taskRepository).toBeDefined();
    });
  });

  describe('createTask:', () => {
    // Task created
    let newTask: Task;

    beforeEach(async () => {
      newTask = await taskService.createTask(createTaskDtoMock);
    });

    // Call the repository methods: create, save
    it('1. it should has been called (Task Repository: create - save)', () => {
      expect(taskRepository.create).toHaveBeenCalledTimes(1);
      expect(taskRepository.save).toHaveBeenCalledTimes(1);
    });

    // Call the repository methods with the correct params
    it('2. it should has been called with the correct params (Task Repository: create - save)', () => {
      expect(taskRepository.create).toHaveBeenCalledWith(createTaskDtoMock);
      expect(taskRepository.save).toHaveBeenCalledWith(createTaskDtoMock);
    });

    // Return new task if everything went well
    it('3. it should return a new Task', () => {
      expect(newTask).toStrictEqual(saveTaskMock);
    });
  });

  describe('getTaskById:', () => {
    let taskById: Task;
    let queryFindOne: FindOneOptions<Task>;
    let id: string;

    beforeEach(async () => {
      id = 'ebfe3d39-def1-42a7-99fe-340e22b0abd3';
      taskById = await taskService.getTaskById(id);
      queryFindOne = {
        where: {
          id,
        },
      };
    });

    // Call the repository method findOne
    it('1. should has been called (Task Repository: findOne)', () => {
      expect(taskRepository.findOne).toHaveBeenCalledTimes(1);
    });

    // Call the repository method with the correct param
    it('2. should has been called with the correct param (Task Repository: findOne)', () => {
      expect(taskRepository.findOne).toHaveBeenCalledWith(queryFindOne);
    });

    // Return the task if everything went well
    it('3. should return the task found by id', () => {
      expect(taskById).toStrictEqual(saveTaskMock);
    });

    // Return not found exception if it wasn't found
    it('4. should throw an exception if the task is not found', async () => {
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(undefined);
      try {
        taskById = await taskService.getTaskById(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        // NotFoundException: Task with id ebfe3d39-def1-42a7-99fe-340e22b0abd3 not found.
      }
    });
  });

  describe('deleteTask:', () => {
    let result: object;
    let id: string;

    beforeEach(async () => {
      id = 'ebfe3d39-def1-42a7-99fe-340e22b0abd3';
      result = await taskService.deleteTask(id);
    });

    it('1. should has been called (Task Repository: delete)', () => {
      expect(taskRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('2. should has been called with the correct param (Task Repository: delete)', () => {
      expect(taskRepository.delete).toHaveBeenCalledWith(id);
    });

    it('3. should return an object if the task was deleted', () => {
      expect(result).toStrictEqual(deleteResMock);
    });

    it('4. should return an exception if the task was not deleted', async () => {
      jest.spyOn(taskRepository, 'delete').mockResolvedValue(deleteMock_0);
      try {
        result = await taskService.deleteTask(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  // describe('updateTaskStatus:', () => {

  // });

  // describe('getTasks:', () => {

  // });
});
