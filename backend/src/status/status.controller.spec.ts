import { Test, TestingModule } from '@nestjs/testing';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';

describe('StatusController', () => {
  let controller: StatusController;
  let service: StatusService;

  const mockStatusService = () => ({
    findAll: jest.fn()
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusController],
      providers: [{ provide: StatusService, useFactory: mockStatusService }],
    }).compile();

    controller = module.get<StatusController>(StatusController);
    service = module.get<StatusService>(StatusService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of statuses', async () => {
    const expected = [];
    jest.spyOn(service, 'findAll').mockResolvedValue(expected);
    const result = await controller.findAllStatuses();
    expect(result).toEqual(expected);
  });
});
