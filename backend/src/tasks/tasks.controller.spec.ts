import { Status } from '@app/status/model/status.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateTaskDto } from './model/create-task.dto';
import { Task } from './model/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = () => ({
    createTask: jest.fn(),
    findAllTasks: jest.fn(),
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
      const dto: CreateTaskDto = { title: 'Test Task', description: 'This is a test task', statusId: 'statusId' };
      const status: Status = { id: 'statusId', name: 'BACKLOG', color: '', orderIndex: 0, tasks: [] };

      const expectedTask: Task = {
        id: 'uuid-123',
        title: dto.title,
        description: dto.description,
        status: status,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(service, 'createTask')
        .mockImplementation((createTaskDto: CreateTaskDto) => Promise.resolve(expectedTask));

      const result = await controller.createTask(dto);
      expect(result).toEqual(expectedTask);
    });
  });

  describe('findAllTasks', () => {
    it('should return an array of tasks', async () => {
      const expected = [];
      jest.spyOn(service, 'findAllTasks').mockResolvedValue(expected);
      const result = await controller.findAllTasks();
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
      const taskId = 'task-uuid-123';
      const statusId = 'status-uuid-456';
      const mockStatus = { id: statusId, name: 'TODO', color: '', orderIndex: 1, tasks: [] } as Status;
      const expectedResult = {
        id: taskId,
        title: 'Test Task',
        description: 'This is a test task',
        status: mockStatus,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Arrange: Tell the mock service what to return
      jest.spyOn(service, 'updateStatus').mockResolvedValue(expectedResult);

      // Act: Call the controller method
      const result = await controller.update(taskId, { statusId });

      // Assert: Verify service was called correctly and result is passed through
      expect(service.updateStatus).toHaveBeenCalledWith(taskId, statusId);
      expect(result).toEqual(expectedResult);
    });
  });
});
