import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class OrdersService implements OnModuleInit, OnModuleDestroy {
  private client: ClientProxy;

  constructor(private prisma: PrismaService) {
    // Configurar la conexión con RabbitMQ
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://user:password@rabbitmq:5672'],
        queue: 'notifications_queue',
        queueOptions: { durable: true },
      },
    });
  }

  async onModuleInit() {
    await this.client.connect(); // Conectar a RabbitMQ al iniciar el módulo
  }

  async onModuleDestroy() {
    await this.client.close(); // Cerrar la conexión al apagar el servicio
  }

  // ✅ Crear una orden y enviar notificación a RabbitMQ
  async createOrder(userId: string) {
    const order = await this.prisma.order.create({
      data: { userId, status: 'pending' },
    });

    console.log(`✅ Orden creada: ${JSON.stringify(order)}`);

    this.client.emit('order_created', { orderId: order.id, userId });

    return order;
  }

  // ✅ Obtener órdenes por usuario
  async getOrdersByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
    });
  }

  // ✅ Actualizar el estado de una orden y enviar evento a RabbitMQ
  async updateOrderStatus(orderId: string, status: string) {
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { user: true },
    });

    console.log(`✅ Estado actualizado: Orden ${orderId} -> ${status}`);

    this.client.emit('order_status_updated', {
      orderId: updatedOrder.id,
      status: updatedOrder.status,
      userId: updatedOrder.userId,
    });

    return updatedOrder;
  }
}
