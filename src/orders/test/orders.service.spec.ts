import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderDto, GetOrdersFilterDto, UpdateOrderDto } from '../domain/dtos';
import { OrdersService } from '../application/orders.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  const mockCommandBus = { execute: jest.fn() };
  const mockQueryBus = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: CommandBus, useValue: mockCommandBus },
        { provide: QueryBus, useValue: mockQueryBus },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call commandBus.execute with CreateOrder command', async () => {
      const dto: CreateOrderDto = {
        userId: 'user1',
        originToken: 'BTS',
        destinationToken: 'USDT',
        amount: 100,
      };
      const meta = { user: { id: 'user1' } };
      mockCommandBus.execute.mockResolvedValue(undefined);

      const result = await service.create(dto, meta);

      expect(commandBus.execute).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual({ success: true, data: dto, meta });
    });
  });

  describe('update', () => {
    it('should call commandBus.execute with UpdateOrder command', async () => {
      const dto: UpdateOrderDto = { id: 'order1', status: 'EXECUTED' };
      const meta = { user: { id: 'user1' } };
      mockCommandBus.execute.mockResolvedValue(undefined);

      const result = await service.update(dto, meta);

      expect(commandBus.execute).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual({ success: true, data: dto, meta });
    });
  });

  describe('getAll', () => {
    it('should call queryBus.execute with GetAllOrders query', async () => {
      const filter: GetOrdersFilterDto = { userId: 'user1' };
      const meta = { user: { id: 'user1' } };
      const mockOrders = [
        { id: '1', originToken: 'BTS', destinationToken: 'USDT', amount: 100, userId: 'user1', status: 'EXECUTED', createdAt: new Date(), updatedAt: new Date() },
      ];
      mockQueryBus.execute.mockResolvedValue(mockOrders);

      const result = await service.getAll(filter, meta);

      expect(queryBus.execute).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual({ success: true, data: mockOrders, meta });
    });
  });
});
