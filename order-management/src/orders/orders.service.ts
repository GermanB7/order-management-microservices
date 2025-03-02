import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
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
        urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'], // Usa .env o localhost por defecto
        queue: 'notifications_queue', // Cambiado para enviar mensajes a notification-service
        queueOptions: { durable: true },
      },
    });
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  async createOrder(userId: string) {
    // Verificar si el usuario existe
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Crear el pedido
    const order = await this.prisma.order.create({
      data: { userId, status: 'pending' },
    });

    // Enviar evento de creación de pedido a RabbitMQ
    this.client.emit('order_created', { orderId: order.id, userId: order.userId });

    return order;
  }

  async getOrdersByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
    });
  }

  async updateOrderStatus(orderId: string, status: string) {
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    // Notificar a `notification-service` sobre el cambio de estado
    this.client.emit('order_status_updated', {
      orderId: updatedOrder.id,
      status: updatedOrder.status,
    });

    return updatedOrder;
  }
}
