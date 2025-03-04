import { Injectable } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Injectable()
export class NotificationsService {

  // 🔹 Escuchar evento de creación de orden
  @EventPattern('order_created')
  handleOrderCreated(@Payload() data: { orderId: string; userId: string }) {
    console.log(`📩 Notificación recibida: Nueva orden creada. Orden ID: ${data.orderId}, Usuario ID: ${data.userId}`);
    this.sendNotification(data.orderId, data.userId, 'Tu orden ha sido creada con éxito.');
  }

  // 🔹 Escuchar evento de actualización de estado de orden
  @EventPattern('order_status_updated')
  handleOrderStatusUpdated(@Payload() data: { orderId: string; status: string; userId: string }) {
    console.log(`📩 Notificación recibida: Estado de orden actualizado. Orden ID: ${data.orderId}, Estado: ${data.status}, Usuario ID: ${data.userId}`);
    this.sendNotification(data.orderId, data.userId, `Tu orden ahora está en estado: ${data.status}`);
  }

  // ✅ Método `sendNotification` agregado
  sendNotification(orderId: string, userId: string, message: string) {
    console.log(`📩 Notificación enviada: ${message} (Order: ${orderId}, User: ${userId})`);
    return { success: true, message };
  }
}
