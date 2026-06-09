import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CreateTaskDto } from './model/create-task.dto';
import type { Task } from './model/task.entity';
import { UpdateTaskStatusDto } from './model/update-task-status.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {

    constructor(private tasksService: TasksService) {}

    @Post()
    async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return await this.tasksService.createTask(createTaskDto);
    }

    @Get()
    async findAllTasks(): Promise<Task[]> {
        return await this.tasksService.findAllTasks();
    }

    @Delete(':id')
    async remove(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.tasksService.remove(id);
    }

    @Patch(':id') update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() updateTaskStatusDto: UpdateTaskStatusDto
    ) {
        return this.tasksService.updateStatus(id, updateTaskStatusDto.statusId);
    }
}
