import { Status } from '@app/status/model/status.entity';
import { StatusService } from '@app/status/status.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './model/task.entity';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let repository;
  let statusService;

  const mockTaskRepository = () => ({
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    preload: jest.fn(),
  });

  const mockStatusService = () => ({
    findById: jest.fn(),
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
        {
          provide: StatusService,
          useFactory: mockStatusService,
        }
      ]
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get(getRepositoryToken(Task));
    statusService = module.get<StatusService>(StatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call repository.find() and return all tasks', async () => {
    //1. Arrange: define what the database should return
    const expectedTasks = [{ id: '1', title: 'Test Task', description: 'Test Description' }];
    repository.find.mockResolvedValue(expectedTasks);
    //2. Act: call the service method
    const result = await service.findAllTasks();
    //3. Assert: check that the result is what we expect
    expect(repository.find).toHaveBeenCalled();
    expect(result).toEqual(expectedTasks);

  });

  it('should call repository.findOneBy() with a string UUID and return a task', async () => {
    const uuid = 'task-uuid-123';
    const expectedTask = { id: uuid, title: 'Test Task', description: 'Test Description' };
    repository.findOneBy.mockResolvedValue(expectedTask);

    const result = await service.findTaskById(uuid);

    expect(repository.findOneBy).toHaveBeenCalledWith({ id: uuid });
    expect(result).toEqual(expectedTask);
   });

  it('should create a task by looking up the status entity', async () => {
    //1. Arrange: define the input and what the database should return
    const statusId = 'status-uuid-123';
    const mockStatus = { id: statusId, name: 'BACKLOG', color: 'mock-color', orderIndex: 0 } as Status;
    const createTaskDto = { title: 'Test Title', description: 'Test Description', statusId: statusId };
    const expectedTask = { id: 'task-uuid-345', ...createTaskDto, status: mockStatus };

    statusService.findById.mockResolvedValue(mockStatus);
    repository.create.mockReturnValue(expectedTask);
    repository.save.mockResolvedValue(expectedTask);

    //2. Act: call the service method
    const result = await service.createTask(createTaskDto);

    //3. Assert: check that the repository methods were called correctly and the result is as expected
    expect(statusService.findById).toHaveBeenCalledWith(statusId);
    expect(repository.create).toHaveBeenCalledWith({
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: mockStatus,
    });
    expect(repository.save).toHaveBeenCalledWith(expectedTask);
    expect(result).toEqual(expectedTask);
  });

  it('should call repository.delete() with a string UUID', async () => {
    const uuid = '99';
    repository.delete.mockResolvedValue({ affected: 1 });

    await service.remove(uuid);

    expect(repository.delete).toHaveBeenCalledWith(uuid);
  });

  it('should find a task, update its status and return it', async () => {
    const taskId = 'task-uuid-123';
    const statusId = 'new-status-uuid';
    const mockStatus = { id: statusId, name: 'IN_PROGRESS' } as Status;
    const updatedTask = { id: taskId, title: 'Test Update', status: mockStatus } as Task;

    // 1. Arrange
    statusService.findById.mockResolvedValue(mockStatus);
    repository.preload.mockResolvedValue(updatedTask); // Simulate preload merging the status
    repository.save.mockResolvedValue(updatedTask);

    // 2. Act
    const result = await service.updateStatus(taskId, statusId);

    // 3. Assert
    expect(statusService.findById).toHaveBeenCalledWith(statusId);
    expect(repository.preload).toHaveBeenCalledWith({ id: taskId, status: mockStatus });
    expect(repository.save).toHaveBeenCalledWith(updatedTask);
    expect(result.status.name).toBe('IN_PROGRESS');
  });

  it('should throw an error if task to update is not found', async () => {
    repository.preload.mockResolvedValue(null);

    await expect(service.updateStatus('invalid-id', 'status-uuid-123'))
      .rejects.toThrow();
  });

  it('should throw an error if the task status is invalid', async () => {
    statusService.findById.mockResolvedValue(null); // Simulate invalid status ID

    await expect(service.updateStatus('task-uuid-123', 'invalid-status-id'))
      .rejects.toThrow();
  });

  it('should throw an error if the statusId does not exist', async () => {
    statusService.findById.mockResolvedValue(null);

    await expect(service.createTask({
      title: 'Fail',
      description: 'This should fail',
      statusId: 'invalid-id'
    })).rejects.toThrow();
  });
});