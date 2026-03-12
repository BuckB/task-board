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
    getTaskById: jest.fn()
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
      const dto: CreateTaskDto = { title: 'Test Task', description: 'This is a test task' };
      const expectedTask: Task = {
        id: 'uuid-123',
        title: dto.title,
        description: dto.description,
        status: TaskStatus.BACKLOG,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      jest.spyOn(service, 'createTask').mockImplementation((createTaskDto: CreateTaskDto) => Promise.resolve(expectedTask));
      const result = await controller.createTask(dto);
      expect(result).toEqual(expectedTask);
    })
  });

  describe('getAllTasks', () => {
    it('should return an array of tasks', async () => {
      const expected = [];
      jest.spyOn(service, 'getAllTasks').mockResolvedValue(expected);
      const result = await controller.getAllTasks();
      expect(result).toEqual(expected);
    })
  });

});
