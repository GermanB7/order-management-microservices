import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, PrismaService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debería crear una orden', async () => {
    const mockOrder = { id: '1', userId: '123', status: 'pending' };
    jest.spyOn(prisma.order, 'create').mockResolvedValue(mockOrder);
    
    const result = await service.createOrder('123');
    expect(result).toEqual(mockOrder);
  });
});
