import { StatusService } from '@app/status/status.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './model/create-task.dto';
import { Task } from './model/task.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
        private readonly statusService: StatusService
    ) {}

    /**
     * Retrieves all tasks from the database.
     * @returns Promise<Task[]>
     */
    async findAllTasks(): Promise<Task[]> {
        return await this.taskRepository.find();
    }

    /**
     * Creates a new task and persists it to the database.
     * ID, createdAt, and updatedAt are handled automatically by TypeORM.
     * @param createTaskDto
     * @returns Promise<Task>
     */
    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description, statusId } = createTaskDto;

        const status = await this.statusService.findById(statusId);
        if (!status) {
            throw new NotFoundException(`Status with id: "${statusId}" not found. Task creation failed.`);
        }

        const task = this.taskRepository.create({
            title: title,
            description: description,
            status: status,
        });

        return await this.taskRepository.save(task);
    }

    /**
     * Find a task by its Id. Useful for the "Update" and "Delete" test cycles.
     * @param id The Id of the task to be found.
     * @returns Promise<Task>
     */
    async findTaskById(id: string): Promise<Task> {
        const found = await this.taskRepository.findOneBy({ id });

        if (!found) {
            throw new NotFoundException(`Task with id: "${id}" not found.`);
        }

        return found;
    }

    /**
     * Deletes a task by its Id. Throws NotFoundException if the task does not exist.
     * @param id The Id of the task to be deleted.
     * @returns Promise<void>
     */
    async remove(id: string): Promise<void> {
        const result = await this.taskRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Task with id: "${id}" not found. Task deletion failed.`);
        }
    }

    /**
     * Updates the status of a task by its Id. Throws NotFoundException if the task or status does not exist.
     * @param id The Id of the task to be updated.
     * @param statusId The Id of the new status.
     * @returns Promise<Task>
     */
    async updateStatus(id: string, statusId: string): Promise<Task> {
        const status = await this.statusService.findById(statusId);
        if (!status) {
            throw new NotFoundException(`Status with id: "${statusId}" not found. Status update failed.`);
        }
        const task = await this.taskRepository.preload({ id: id, status: status });
        if (!task) {
            throw new NotFoundException(`Task with id: "${id}" not found. Status update failed.`);
        }
        return await this.taskRepository.save(task);
    }
}
