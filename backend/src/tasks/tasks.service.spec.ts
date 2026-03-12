import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { Task } from './task/task.entity';

describe('TasksService', () => {
  let service: TasksService;
  let repository;

  const mockTaskRepository = () => ({
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          // This tells Nest: "If someone wants the Task Repository..."
          provide: getRepositoryToken(Task),
          // "...give them our Mock instead."
          useFactory: mockTaskRepository,
        },
      ]
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calls repository.find()', () => {
    it('should return all tasks', async () => {
      //1. Arrange: define what the database should return
      const expectedTasks = [{ id: '1', title: 'Test Task', description: 'Test Description' }];
      repository.find.mockResolvedValue(expectedTasks);
      //2. Act: call the service method
      const result = await service.getAllTasks();
      //3. Assert: check that the result is what we expect
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(expectedTasks);
    })
  });

  describe('calls repository.create() and repository.save()', () => {
    it('should persist a task', async () => {
      //1. Arrange: define the input and what the database should return
      const createTaskDto = { title: 'Test Title', description: 'Test Description' };
      const expectedTask = { id: '1', ...createTaskDto, status: 'BACKLOG' };
      repository.create.mockReturnValue(expectedTask);
      repository.save.mockResolvedValue(expectedTask);
      //2. Act: call the service method
      const result = await service.createTask(createTaskDto);
      //3. Assert: check that the repository methods were called correctly and the result is as expected
      expect(repository.create).toHaveBeenCalledWith({
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: 'BACKLOG',
      });
      expect(repository.save).toHaveBeenCalledWith(expectedTask);
      expect(result).toEqual(expectedTask);
    })
  });
});
