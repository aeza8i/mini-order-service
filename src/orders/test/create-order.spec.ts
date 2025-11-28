import { CreateOrderDto } from '../domain/dtos';
import { IMetadata } from '../domain/interfaces';
import { CreateOrder } from '../application/commands/impl';

describe('CreateOrder Command', () => {
  it('should create an instance with data and metadata', () => {
    const dto: CreateOrderDto = {
      userId: 'user1',
      originToken: 'BTS',
      destinationToken: 'USDT',
      amount: 100,
    };

    const meta: IMetadata = { user: { id: 'user1' } };

    const command = new CreateOrder(dto, meta);

    expect(command.data).toBe(dto);
    expect(command.meta).toBe(meta);
  });
});
