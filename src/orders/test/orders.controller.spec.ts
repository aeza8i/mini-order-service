import { Test, TestingModule } from '@nestjs/testing';
import { IOrdersService } from '../domain/interfaces';
import { CreateOrderDto, GetOrdersFilterDto } from '../domain/dtos';
import { OrdersController } from '../interface/orders.controller';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: IOrdersService;

  const mockOrdersService = {
    create: jest.fn(),
    update: jest.fn(),
    getAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: 'IOrdersService',
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<IOrdersService>('IOrdersService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct data and metadata', async () => {
      const dto: CreateOrderDto = {
        userId: 'user1',
        originToken: 'BTS',
        destinationToken: 'USDT',
        amount: 100
      };
      const metadata = { user: { id: 'user1' } };
      mockOrdersService.create.mockResolvedValue('ok');

      const result = await controller.create(dto);
      expect(mockOrdersService.create).toHaveBeenCalledWith(dto, metadata);
      expect(result).toBe('ok');
    });
  });

  describe('execute', () => {
    it('should call service.update with EXECUTED status', async () => {
      mockOrdersService.update.mockResolvedValue('ok');

      const result = await controller.execute('order1');
      expect(mockOrdersService.update).toHaveBeenCalledWith(
        { id: 'order1', status: 'EXECUTED' },
        { user: { id: '' } },
      );
      expect(result).toBe('ok');
    });
  });

  describe('cancel', () => {
    it('should call service.update with CANCELED status', async () => {
      mockOrdersService.update.mockResolvedValue('ok');

      const result = await controller.cancel('order2');
      expect(mockOrdersService.update).toHaveBeenCalledWith(
        { id: 'order2', status: 'CANCELED' },
        { user: { id: '' } },
      );
      expect(result).toBe('ok');
    });
  });

  describe('getAll', () => {
    it('should call service.getAll with filter and metadata', async () => {
      const filter: GetOrdersFilterDto = { userId: 'user1' };
      mockOrdersService.getAll.mockResolvedValue(['order1', 'order2']);

      const result = await controller.getAll(filter);
      expect(mockOrdersService.getAll).toHaveBeenCalledWith(filter, { user: { id: '' } });
      expect(result).toEqual(['order1', 'order2']);
    });
  });
});
