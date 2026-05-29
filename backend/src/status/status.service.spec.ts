import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Status } from './model/status.entity';
import { StatusService } from './status.service';

describe('StatusService', () => {
  let service: StatusService;
  let repository;

  const mockStatusRepository = () => ({
    find: jest.fn(),
    findOneBy: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatusService,
        {
          provide: getRepositoryToken(Status),
          useFactory: mockStatusRepository,
        }
      ],
    }).compile();

    service = module.get<StatusService>(StatusService);
    repository = module.get(getRepositoryToken(Status));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all statuses ordered by orderIndex', async () => {
    const expected = [
      { id: 'status-uuid-0', name: 'BACKLOG', color: '#94a3b8', orderIndex: 0 },
      { id: 'status-uuid-1', name: 'TODO', color: '#3b82f6', orderIndex: 1 },
      { id: 'status-uuid-2', name: 'IN_PROGRESS', color: '#f59e0b', orderIndex: 2 },
      { id: 'status-uuid-3', name: 'DONE', color: '#10b981', orderIndex: 3 }
    ];
    repository.find.mockResolvedValue(expected);

    const result = await service.findAll();

    expect(repository.find).toHaveBeenCalledWith({
      order: { orderIndex: 'ASC' },
    });
    expect(result).toEqual(expected);
  });

  it('should find a status by id', async () => {
    const statusId = 'status-uuid-123';
    const expectedStatus = { id: statusId, name: 'TODO', color: '#3b82f6', orderIndex: 1 };
    repository.findOneBy.mockResolvedValue(expectedStatus);

    const result = await service.findById(statusId);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: statusId });
    expect(result).toEqual(expectedStatus);
  });
});
