import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../../src/shared';
import { AppModule } from '../../src/app.module';
import { CreateOrderDto } from '../../src/orders/domain/dtos';
import { v4 as uuidv4 } from 'uuid';

describe('OrdersController (E2E Real)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // enable global validation pipes like real app
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    prisma = app.get<PrismaService>(PrismaService);

    // clean database before starting
    await prisma.order.deleteMany();
    await prisma.orderEvent.deleteMany();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.order.deleteMany();
    await prisma.orderEvent.deleteMany();
  });

  const createSample = async () => {
    return await request(app.getHttpServer())
      .post('/api/v1/orders')
      .send({
        userId: 'user1',
        originToken: 'BTS',
        destinationToken: 'USDT',
        amount: 100,
      })
      .expect(201);
  }

  it('POST /api/v1/orders should create a new order', async () => {

    const res = await createSample()

    expect(res.body.success).toBe(true);
    expect(res.body.data.originToken).toBe('BTS');

    const ordersInDb = await prisma.order.findMany();
    expect(ordersInDb.length).toBe(1);
    expect(ordersInDb[0].originToken).toBe('BTS');
    expect(ordersInDb[0].status).toBe('PENDING');
  });

  it('PATCH /api/v1/orders/:id/execute should execute an order', async () => {
    await createSample();
    const ordersInDb = await prisma.order.findMany();
    expect(ordersInDb.length).toBe(1);
    const orderId = ordersInDb[0].id;

    const res = await request(app.getHttpServer())
      .patch(`/api/v1/orders/${orderId}/execute`)
      .expect(200);

    expect(res.body.success).toBe(true);

    const updated = await prisma.order.findUnique({ where: { id: orderId } });
    expect(updated.status).toBe('EXECUTED');
  });

  it('PATCH /api/v1/orders/:id/cancel should cancel an order', async () => {
    await createSample();
    const ordersInDb = await prisma.order.findMany();
    expect(ordersInDb.length).toBe(1);
    const orderId = ordersInDb[0].id;

    const res = await request(app.getHttpServer())
      .patch(`/api/v1/orders/${orderId}/cancel`)
      .expect(200);

    expect(res.body.success).toBe(true);

    const updated = await prisma.order.findUnique({ where: { id: orderId } });
    expect(updated.status).toBe('CANCELED');
  });

  it('GET /api/v1/orders should return all orders', async () => {
    await prisma.order.createMany({
      data: [
        { id: uuidv4(), originToken: 'BTS', destinationToken: 'USDT', amount: 100, status: 'PENDING', userId: 'user1' },
        { id: uuidv4(), originToken: 'ETH', destinationToken: 'USDT', amount: 50, status: 'EXECUTED', userId: 'user2' },
      ],
    });

    const res = await request(app.getHttpServer())
      .get('/api/v1/orders')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

  it('GET /api/v1/orders with filter should return filtered orders', async () => {
    await prisma.order.createMany({
      data: [
        { id: uuidv4(), originToken: 'BTS', destinationToken: 'USDT', amount: 100, status: 'PENDING', userId: 'user1' },
        { id: uuidv4(), originToken: 'ETH', destinationToken: 'USDT', amount: 50, status: 'EXECUTED', userId: 'user2' },
      ],
    });

    const res = await request(app.getHttpServer())
      .get('/api/v1/orders')
      .query({ status: 'EXECUTED' })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].status).toBe('EXECUTED');
  });
});
