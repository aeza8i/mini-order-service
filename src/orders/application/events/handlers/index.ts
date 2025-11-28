import { OrderCreatedHandler } from './order-created.handler';
import { OrderUpdatedHandler } from './order-updated.handler';

export const EventHandlers = [
  OrderCreatedHandler,
  OrderUpdatedHandler
];
