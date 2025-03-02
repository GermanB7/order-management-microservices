import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://user:password@rabbitmq:5672'],
      queue: 'notifications_queue',
      queueOptions: { durable: true },
    },
  });

  console.log('🚀 Notification Service is listening for messages...');
  await app.listen();
}
bootstrap();
