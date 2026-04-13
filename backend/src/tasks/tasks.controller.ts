import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CreateTaskDto } from './task/dto/create-task.dto';
import { UpdateTaskStatusDto } from './task/dto/update-task-status.dto';
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

    @Patch(':id/status') update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() updateTaskStatusDto: UpdateTaskStatusDto
    ) {
        return this.tasksService.updateStatus(id, updateTaskStatusDto.status);
    }
}
