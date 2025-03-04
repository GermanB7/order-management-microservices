import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @MessagePattern('order_created')
  async handleOrderCreated(@Payload() data: { orderId: string; userId: string }) {
    this.logger.log(`📩 Evento recibido 'order_created': ${JSON.stringify(data)}`);
    await this.notificationsService.sendNotification(
      data.orderId,
      data.userId,
      'Tu orden ha sido creada con éxito!'
    );
  }

  @MessagePattern('order_status_updated')
  async handleOrderStatusUpdated(@Payload() data: { orderId: string; status: string; userId: string }) {
    this.logger.log(`📩 Evento recibido 'order_status_updated': ${JSON.stringify(data)}`);
    await this.notificationsService.sendNotification(
      data.orderId,
      data.userId, // ✅ Ahora sí existe
      `El estado de tu orden ha cambiado a: ${data.status}`
    );
  }
}
