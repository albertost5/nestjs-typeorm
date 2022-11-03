import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    create(@Body() createTaskDto: CreateTaskDto): Task {
        return this.tasksService.create(createTaskDto);
    }

    // @Post()
    // create(@Body('title') title: string, @Body('description') description: string): Task {
    //     return this.tasksService.create(title, description);
    // }

    // @Post('v2')
    // create_v2(@Body() payload: any): Task {
    //     return this.tasksService.create(payload.title, payload.description);
    // }

    @Get()
    find(@Query() filterDto: GetTasksFilterDto): Task[] {
        const { status, search } = filterDto;

        if( !status && !search ) return this.tasksService.find();
        
        return this.tasksService.findWithFilters(filterDto);
    }
    
    @Get(':id')
    findOne(@Param('id') id: string): Task {
        return this.tasksService.findOne(id);
    }

    @Patch(':id/status')
    updateTaskStatus(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskStatusDto): Task {
        const { status } = updateTaskDto;
        return this.tasksService.updateTaskStatus(id, status);
    }

    @Delete(':id')
    delete(@Param('id') id: string): object {
        return this.tasksService.delete(id)
    }

}
