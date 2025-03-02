import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('order_created')
  handleOrderCreated(@Payload() data: { orderId: string; userId: string }) {
    console.log('📦 Pedido creado recibido:', data);
    return this.notificationsService.sendNotification(
      data.orderId,
      data.userId,
      'Tu pedido ha sido creado exitosamente.',
    );
  }

  @EventPattern('order_status_updated')
  handleOrderStatusUpdated(@Payload() data: { orderId: string; status: string }) {
    console.log('🔄 Pedido actualizado recibido:', data);
    return this.notificationsService.sendNotification(
      data.orderId,
      '',
      `El estado de tu pedido ha cambiado a: ${data.status}`,
    );
  }
}
