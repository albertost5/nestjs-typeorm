import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
// import { Task } from './task.model';
import { TasksService } from './tasks.service';
import { Logger } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
    this.logger.log(`getTasks invoked...`);
    return this.tasksService.getTasks(filterDto);
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string): Promise<object> {
    return this.tasksService.deleteTask(id);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    this.logger.log(
      `updateTaskStatus invoked... Body: ${JSON.stringify(
        updateTaskStatusDto,
      )}`,
    );
    return this.tasksService.updateTaskStatus(id, updateTaskStatusDto);
  }

  // @Post()
  // create(@Body() createTaskDto: CreateTaskDto): Task {
  //   return this.tasksService.create(createTaskDto);
  // }

  // @Post()
  // create(@Body('title') title: string, @Body('description') description: string): Task {
  //     return this.tasksService.create(title, description);
  // }

  // @Post('v2')
  // create_v2(@Body() payload: any): Task {
  //     return this.tasksService.create(payload.title, payload.description);
  // }

  // @Get()
  // find(@Query() filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;

  //   if (!status && !search) return this.tasksService.find();

  //   return this.tasksService.findWithFilters(filterDto);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string): Task {
  //   return this.tasksService.findOne(id);
  // }

  // @Patch(':id/status')
  // updateTaskStatus(
  //   @Param('id') id: string,
  //   @Body() updateTaskDto: UpdateTaskStatusDto,
  // ): Task {
  //   const { status } = updateTaskDto;
  //   return this.tasksService.updateTaskStatus(id, status);
  // }

  // @Delete(':id')
  // delete(@Param('id') id: string): object {
  //   return this.tasksService.delete(id);
  // }
}
