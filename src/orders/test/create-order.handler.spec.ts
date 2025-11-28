import { Test, TestingModule } from '@nestjs/testing';
import { EventPublisher } from '@nestjs/cqrs';
import { CreateOrderHandler } from '../application/commands/handlers/create-order.handler';
import { IOrdersRepository } from '../application/orders.repository.interface';
import { CreateOrder } from '../application/commands/impl';
import { Order } from '../domain/models/order.model';

describe('CreateOrderHandler', () => {
  let handler: CreateOrderHandler;
  let publisher: EventPublisher;
  let repository: IOrdersRepository;

  const mockPublisher = {
    mergeObjectContext: jest.fn(),
  };

  const mockRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrderHandler,
        { provide: EventPublisher, useValue: mockPublisher },
        { provide: 'IOrdersRepository', useValue: mockRepository },
      ],
    }).compile();

    handler = module.get<CreateOrderHandler>(CreateOrderHandler);
    publisher = module.get<EventPublisher>(EventPublisher);
    repository = module.get<IOrdersRepository>('IOrdersRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should execute CreateOrder command', async () => {
    const dto = {
      userId: 'user1',
      originToken: 'BTS',
      destinationToken: 'USDT',
      amount: 100,
    };
    const meta = { user: { id: 'user1' } };

    // Mock Order instance
    const mockOrder = {
      create: jest.fn(),
      commit: jest.fn(),
    };

    mockPublisher.mergeObjectContext.mockReturnValue(mockOrder);

    const command = new CreateOrder(dto, meta);

    await handler.execute(command);

    expect(mockPublisher.mergeObjectContext).toHaveBeenCalledWith(expect.any(Order));

    expect(mockOrder.create).toHaveBeenCalledWith(dto, meta);
    expect(mockOrder.commit).toHaveBeenCalled();
  });

  it('should throw error if create fails', async () => {
    const dto = {
      userId: 'user1',
      originToken: 'BTS',
      destinationToken: 'USDT',
      amount: 100,
    };
    const meta = { user: { id: 'user1' } };

    const mockOrder = {
      create: jest.fn().mockImplementation(() => { throw new Error('fail'); }),
      commit: jest.fn(),
    };

    mockPublisher.mergeObjectContext.mockReturnValue(mockOrder);

    const command = new CreateOrder(dto, meta);

    await expect(handler.execute(command)).rejects.toThrow('fail');
    expect(mockOrder.create).toHaveBeenCalledWith(dto, meta);
    expect(mockOrder.commit).not.toHaveBeenCalled();
  });
});
