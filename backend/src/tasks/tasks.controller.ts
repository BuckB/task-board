import { Body, Controller, Post } from '@nestjs/common';
import { CreateTaskDto } from './task/dto/create-task.dto';
import type { Task } from './task/task.interface';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) {}
    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto): Task {
        return this.taskService.createTask(createTaskDto);
    }
}
