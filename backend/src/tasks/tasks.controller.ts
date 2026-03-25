import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CreateTaskDto } from './task/dto/create-task.dto';
import type { Task } from './task/task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {

    constructor(private tasksService: TasksService) { }

    @Post()
    async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return await this.tasksService.createTask(createTaskDto);
    }

    @Get()
    async getAllTasks(): Promise<Task[]> {
        return await this.tasksService.getAllTasks();
    }

    @Delete(':id')
    async remove(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.tasksService.remove(id);
    }
}
