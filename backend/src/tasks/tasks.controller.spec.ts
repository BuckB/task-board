import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TaskStatus } from './task/task-status.enum';
import { Task } from './task/task.interface';
import { CreateTaskDto } from './task/dto/create-task.dto';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService]
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTask', () => {
    it('should create and return a new task', () => {
      const dto: CreateTaskDto = { title: 'Test Task', description: 'This is a test task' };
      const expectedTask: Task = {
        id: 'uuid-123',
        title: dto.title,
        description: dto.description,
        status: TaskStatus.BACKLOG,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      jest.spyOn(service, 'createTask').mockImplementation(() => expectedTask);
      const result = controller.createTask(dto);
      expect(result).toEqual(expectedTask);
    })
  });
});
