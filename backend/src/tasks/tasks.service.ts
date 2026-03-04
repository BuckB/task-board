import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './task/dto/create-task.dto';
import { Task } from './task/task.interface';
import { TaskStatus } from './task/task-status.enum';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];
    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;
        const newTask: Task = {
            id: Date.now().toString(), // In a real application, you would generate a unique ID
            title,
            description,
            status: TaskStatus.BACKLOG, // Default status
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.tasks.push(newTask);
        return newTask;
    }
}
