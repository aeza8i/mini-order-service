import { Test, TestingModule } from '@nestjs/testing';
import { EventPublisher } from '@nestjs/cqrs';
import { IOrdersRepository } from '../application/orders.repository.interface';
import { IOrderFactory } from '../domain/interfaces';
import { UpdateOrderHandler } from '../application/commands/handlers/update-order.handler';
import { UpdateOrder } from '../application/commands/impl';
import { Order } from '../domain/models/order.model';
import { UpdateOrderDto } from '../domain/dtos';

describe('UpdateOrderHandler', () => {
  let handler: UpdateOrderHandler;
  let publisher: EventPublisher;
  let repository: IOrdersRepository;
  let factory: IOrderFactory;

  const mockPublisher = {
    mergeObjectContext: jest.fn(),
  };

  const mockRepository = {
    getEvents: jest.fn(),
  };

  const mockFactory = {
    reconstitute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateOrderHandler,
        { provide: EventPublisher, useValue: mockPublisher },
        { provide: 'IOrdersRepository', useValue: mockRepository },
        { provide: 'IOrderFactory', useValue: mockFactory },
      ],
    }).compile();

    handler = module.get<UpdateOrderHandler>(UpdateOrderHandler);
    publisher = module.get<EventPublisher>(EventPublisher);
    repository = module.get<IOrdersRepository>('IOrdersRepository');
    factory = module.get<IOrderFactory>('IOrderFactory');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should execute UpdateOrder command', async () => {
    const data: UpdateOrderDto = { id: 'order1', status: 'EXECUTED' };
    const meta = { user: { id: 'user1' } };
    const command = new UpdateOrder(data, meta);

    const mockOrder = { update: jest.fn(), commit: jest.fn() };
    const mockEvents = ['event1', 'event2'];

    mockRepository.getEvents.mockResolvedValue(mockEvents);
    mockFactory.reconstitute.mockReturnValue(new Order());
    mockPublisher.mergeObjectContext.mockReturnValue(mockOrder);

    await handler.execute(command);

    expect(mockRepository.getEvents).toHaveBeenCalledWith(data.id);
    expect(mockFactory.reconstitute).toHaveBeenCalledWith(mockEvents);
    expect(mockPublisher.mergeObjectContext).toHaveBeenCalledWith(expect.any(Order));
    expect(mockOrder.update).toHaveBeenCalledWith(data, meta);
    expect(mockOrder.commit).toHaveBeenCalled();
  });

  it('should throw error if update fails', async () => {
    const data: UpdateOrderDto = { id: 'order1', status: 'EXECUTED' };
    const meta = { user: { id: 'user1' } };
    const command = new UpdateOrder(data, meta);

    const mockOrder = {
      update: jest.fn().mockImplementation(() => { throw new Error('fail'); }),
      commit: jest.fn(),
    };

    const mockEvents = ['event1'];
    mockRepository.getEvents.mockResolvedValue(mockEvents);
    mockFactory.reconstitute.mockReturnValue(new Order());
    mockPublisher.mergeObjectContext.mockReturnValue(mockOrder);

    await expect(handler.execute(command)).rejects.toThrow('fail');
    expect(mockOrder.update).toHaveBeenCalledWith(data, meta);
    expect(mockOrder.commit).not.toHaveBeenCalled();
  });
});
