import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  async sendNotification(orderId: string, userId: string, message: string) {
    console.log(`📩 Notificación enviada: ${message} (Order: ${orderId}, User: ${userId})`);
    
    return { success: true, message };
  }
}
