import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
// import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Injectable()
export class TasksService {

  private logger = new Logger('TaskService', {
    timestamp: true
  });

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.taskRepository.create({
      title: title,
      description: description,
    });

    await this.taskRepository.save(task);

    return task;
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task with id ${id} not found.`);

    return task;
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { search, status } = filterDto;

    const query = this.taskRepository.createQueryBuilder('task');

    if (status) query.andWhere('task.status = :status', { status });
    if (search)
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(`Error: ${error}`);
      throw new InternalServerErrorException();
    }

  }

  async deleteTask(id: string): Promise<object> {
    const { affected } = await this.taskRepository.delete(id);

    if (affected === 0)
      throw new NotFoundException(`Task with id ${id} not found.`);

    return {
      message: 'Task deleted successfully!',
    };
  }

  async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;

    const task = await this.getTaskById(id);
    task.status = status;
    await this.taskRepository.save(task);

    return task;
  }

  // private tasks: Task[] = [];

  // create(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;

  //   const task: Task = {
  //     id: uuidv4(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };

  //   this.tasks.push(task);
  //   return task;
  // }

  // create(title: string, description: string): Task {
  //     const task: Task = {
  //         id: uuidv4(),
  //         title,
  //         description,
  //         status: TaskStatus.OPEN
  //     }

  //     this.tasks.push(task)
  //     return task;
  // }

  // find(): Task[] {
  //   return this.tasks;
  // }

  // findOne(id: string): Task {
  //   const task = this.tasks.find((t) => t.id === id);

  //   // if ( !task ) throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
  //   /**
  //        * {
  //           "statusCode": 404,
  //           "message": "NOT_FOUND"
  //           }
  //       */

  //   if (!task) throw new NotFoundException(`Task with id ${id} not found.`);
  //   /**
  //        * {
  //           "statusCode": 404,
  //           "message": "Task with id 1234 not found.",
  //           "error": "Not Found"
  //           }
  //       */
  //   return task;
  // }

  // findWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;

  //   let allTasks = this.find();

  //   if (status) allTasks = allTasks.filter((t) => t.status === status);
  //   if (search)
  //     allTasks = allTasks.filter(
  //       (t) => t.description.includes(search) || t.title.includes(search),
  //     );

  //   return allTasks;
  // }

  // updateTaskStatus(id: string, status: TaskStatus): Task {
  //   const task = this.findOne(id);
  //   task.status = status;
  //   return task;
  // }

  // delete(id: string): object {
  //   const task = this.findOne(id);
  //   this.tasks = this.tasks.filter((t) => t.id !== task.id);

  //   return {
  //     message: 'Task deleted successfully!',
  //   };
  // }
}
