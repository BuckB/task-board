import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './task/dto/create-task.dto';
import { TaskStatus } from './task/task-status.enum';
import { Task } from './task/task.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>
    ) { }

    /**
     * Retrieves all tasks from the database.
     */
    async getAllTasks(): Promise<Task[]> {
        return await this.taskRepository.find();
    }

    /**
     * Creates a new task and persists it to the database.
     * ID, createdAt, and updatedAt are handled automatically by TypeORM.
     */
    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = this.taskRepository.create({
            title,
            description,
            status: TaskStatus.BACKLOG,
        });

        return await this.taskRepository.save(task);
    }

    /**
     * Helper for TDD: Get a single task by ID.
     * Useful for the "Update" and "Delete" test cycles.
     */
    async getTaskById(id: string): Promise<Task> {
        const found = await this.taskRepository.findOneBy({ id });

        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return found;
    }

    async remove(id: string): Promise<void> {
        const result = await this.taskRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }

    async updateStatus(id: string, status: TaskStatus): Promise<Task> {
        const task = await this.taskRepository.preload({ id: id, status: status });
        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return await this.taskRepository.save(task);
    }
}
