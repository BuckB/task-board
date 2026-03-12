import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTaskDto } from './task/dto/create-task.dto';
import type { Task } from './task/task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {

    constructor(private taskService: TasksService) {}

    @Post()
    async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return await this.taskService.createTask(createTaskDto);
    }

    @Get()
    async getAllTasks(): Promise<Task[]> {
        return await this.taskService.getAllTasks();
    }
}
