import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
// import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  


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
