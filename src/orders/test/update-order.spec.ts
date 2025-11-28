import { UpdateOrderDto } from '../domain/dtos';
import { IMetadata } from '../domain/interfaces';
import { UpdateOrder } from '../application/commands/impl';

describe('UpdateOrder Command', () => {
  it('should create an instance with data and metadata', () => {
    const dto: UpdateOrderDto = {
      id: 'order1',
      status: 'EXECUTED',
    };

    const meta: IMetadata = { user: { id: 'user1' } };

    const command = new UpdateOrder(dto, meta);

    expect(command.data).toBe(dto);
    expect(command.meta).toBe(meta);
  });
});
