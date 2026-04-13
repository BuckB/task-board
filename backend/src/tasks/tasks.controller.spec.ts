import { Test, TestingModule } from '@nestjs/testing';
import { CreateTaskDto } from './task/dto/create-task.dto';
import { TaskStatus } from './task/task-status.enum';
import { Task } from './task/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = () => ({
    createTask: jest.fn(),
    getAllTasks: jest.fn(),
    getTaskById: jest.fn(),
    remove: jest.fn(),
    updateStatus: jest.fn()
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useFactory: mockTasksService }]
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTask', () => {
    it('should create and return a new task', async () => {
      const dto: CreateTaskDto = { title: 'Test Task', description: 'This is a test task', status: TaskStatus.BACKLOG };
      const expectedTask: Task = {
        id: 'uuid-123',
        title: dto.title,
        description: dto.description,
        status: dto.status,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(service, 'createTask').mockImplementation((createTaskDto: CreateTaskDto) => Promise.resolve(expectedTask));
      const result = await controller.createTask(dto);
      expect(result).toEqual(expectedTask);
    });
  });

  describe('getAllTasks', () => {
    it('should return an array of tasks', async () => {
      const expected = [];
      jest.spyOn(service, 'getAllTasks').mockResolvedValue(expected);
      const result = await controller.getAllTasks();
      expect(result).toEqual(expected);
    });
  });

  describe('deleteTask', () => {
    it('should send a DELETE request', async () => {
      const id = 'uuid-123';
      const removeSpy = jest.spyOn(service, 'remove').mockResolvedValue(undefined);
      await controller.remove(id);
      expect(removeSpy).toHaveBeenCalledWith(id);
    });
  });

  describe('updateTaskStatus', () => {
    it('should call the service to update status and return the result', async () => {
      const id = 'uuid-123';
      const status = TaskStatus.DONE;
      const expectedResult = { id, status } as Task;

      // Arrange: Tell the mock service what to return
      jest.spyOn(service, 'updateStatus').mockResolvedValue(expectedResult);

      // Act: Call the controller method
      const result = await controller.update(id, { status });

      // Assert: Verify service was called correctly and result is passed through
      expect(service.updateStatus).toHaveBeenCalledWith(id, status);
      expect(result).toEqual(expectedResult);
    });
  });
});
