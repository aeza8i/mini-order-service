import { Order } from '../domain/models/order.model';
import { OrderCreated, OrderUpdated } from '../domain/events';
import { CreateOrderDto, UpdateOrderDto } from '../domain/dtos';
import { UnauthorizedException, AlreadyProcessedException } from '../domain/exceptions';
import { IMetadata } from '../domain/interfaces';

describe('Order Aggregate', () => {
  let order: Order;
  let meta: IMetadata;

  beforeEach(() => {
    order = new Order();
    meta = { user: { id: 'user1' } };
  });

  describe('create', () => {
    it('should apply OrderCreated event with correct data', () => {
      const dto: CreateOrderDto = {
        userId: 'user1',
        originToken: 'BTS',
        destinationToken: 'USDT',
        amount: 100,
      };

      order.create(dto, meta);

      const events = order.getUncommittedEvents();
      expect(events.length).toBe(1);
      expect(events[0]).toBeInstanceOf(OrderCreated);

      const eventData = (events[0] as OrderCreated).data;
      expect(eventData.originToken).toBe('BTS');
      expect(eventData.destinationToken).toBe('USDT');
      expect(eventData.amount).toBe(100);
      expect(eventData.status).toBe('PENDING');
      expect(eventData.requester.user.id).toBe('user1');
    });

    it('should throw UnauthorizedException for invalid requester', () => {
      const dto: CreateOrderDto = {
        userId: 'invalidUser',
        originToken: 'BTS',
        destinationToken: 'USDT',
        amount: 100,
      };

      expect(() => order.create(dto, meta)).toThrow(UnauthorizedException);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      const dto: CreateOrderDto = {
        userId: 'user1',
        originToken: 'BTS',
        destinationToken: 'USDT',
        amount: 100,
      };
      order.create(dto, meta);
      order.onOrderCreated(order.getUncommittedEvents()[0] as OrderCreated);
    });

    it('should apply OrderUpdated event when status is PENDING', () => {
      const updateDto: UpdateOrderDto = { id: order.id, status: 'EXECUTED' };

      order.update(updateDto, meta);

      const events = order.getUncommittedEvents().filter(e => e instanceof OrderUpdated);
      expect(events.length).toBe(1);
      const eventData = (events[0] as OrderUpdated).data;
      expect(eventData.status).toBe('EXECUTED');
    });

    it('should throw AlreadyProcessedException if status is not PENDING', () => {
      order.status = 'EXECUTED';
      const updateDto: UpdateOrderDto = { id: order.id, status: 'CANCELED' };

      expect(() => order.update(updateDto, meta)).toThrow(AlreadyProcessedException);
    });
  });

  describe('onOrderCreated', () => {
    it('should update internal state correctly', () => {
      const event = new OrderCreated({
        id: 'order1',
        originToken: 'BTS',
        destinationToken: 'USDT',
        amount: 100,
        status: 'PENDING',
        requester: { user: { id: 'user1' } },
      }, meta);

      order.onOrderCreated(event);

      expect(order.id).toBe('order1');
      expect(order.originToken).toBe('BTS');
      expect(order.destinationToken).toBe('USDT');
      expect(order.amount).toBe(100);
      expect(order.status).toBe('PENDING');
      expect(order.requester.user.id).toBe('user1');
    });
  });

  describe('onOrderUpdated', () => {
    it('should update status correctly', () => {
      order.status = 'PENDING';
      const event = new OrderUpdated({ id: 'order1', status: 'EXECUTED' }, meta);

      order.onOrderUpdated(event);

      expect(order.status).toBe('EXECUTED');
    });
  });

  describe('getVersionedMeta', () => {
    it('should increment version correctly', () => {
      order.version = 5;
      const newMeta = order.getVersionedMeta(meta);

      expect(newMeta.version).toBe(6);
    });

    it('should start from 1 if version is undefined', () => {
      order.version = undefined;
      const newMeta = order.getVersionedMeta(meta);

      expect(newMeta.version).toBe(1);
    });
  });
});
