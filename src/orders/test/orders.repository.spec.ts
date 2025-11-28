import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../shared';
import { OrdersRepository } from '../infrastructure/orders.repository';
import { OrderCreatedDto, OrderUpdatedDto, GetOrdersFilterDto } from '../domain/dtos';

describe('OrdersRepository', () => {
  let repository: OrdersRepository;
  let prisma: any;

  const mockPrisma: any = {
    order: {
      create: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
      findMany: jest.fn().mockResolvedValue([{ id: 'order1' }]),
    },
    orderEvent: {
      findMany: jest.fn().mockResolvedValue(['event1', 'event2']),
      create: jest.fn().mockResolvedValue(undefined),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<OrdersRepository>(OrdersRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should call prisma.order.create with correct data', async () => {
      const dto: OrderCreatedDto = {
        id: 'order1',
        status: 'PENDING',
        requester: { user: { id: 'user1' } },
        originToken: 'BTS',
        destinationToken: 'USDT',
        amount: 100,
      };

      await repository.create(dto);

      expect(prisma.order.create).toHaveBeenCalledWith({
        data: {
          id: 'order1',
          status: 'PENDING',
          originToken: 'BTS',
          destinationToken: 'USDT',
          amount: 100,
          userId: 'user1',
        },
      });
    });
  });

  describe('update', () => {
    it('should call prisma.order.update with correct data', async () => {
      const dto: OrderUpdatedDto = { id: 'order1', status: 'EXECUTED' };

      await repository.update(dto);

      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order1' },
        data: { status: 'EXECUTED' },
      });
    });
  });

  describe('getEvents', () => {
    it('should call prisma.orderEvent.findMany with correct where and orderBy', async () => {
      const id = 'order1';
      (prisma.orderEvent.findMany as jest.Mock).mockResolvedValue(['event1', 'event2']);

      const result = await repository.getEvents(id);

      expect(prisma.orderEvent.findMany).toHaveBeenCalledWith({
        where: { aggregateId: id },
        orderBy: { sequence: 'asc' },
      });
      expect(result).toEqual(['event1', 'event2']);
    });
  });

  describe('appendEvent', () => {
    it('should call prisma.orderEvent.create with correct data', async () => {
      await repository.appendEvent('order1', 'CREATED', 1, { foo: 'bar' });

      expect(prisma.orderEvent.create).toHaveBeenCalledWith({
        data: {
          aggregateId: 'order1',
          type: 'CREATED',
          payload: { foo: 'bar' },
          sequence: 1,
        },
      });
    });
  });

  describe('getAll', () => {
    it('should call prisma.order.findMany with filters', async () => {
      const filter: GetOrdersFilterDto = { userId: 'user1', status: 'EXECUTED' };
      (prisma.order.findMany as jest.Mock).mockResolvedValue([{ id: 'order1' }]);

      const result = await repository.getAll(filter);

      expect(prisma.order.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1', status: 'EXECUTED' },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([{ id: 'order1' }]);
    });

    it('should call prisma.order.findMany without optional filters', async () => {
      const filter: GetOrdersFilterDto = {};
      (prisma.order.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repository.getAll(filter);

      expect(prisma.order.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([]);
    });
  });
});
