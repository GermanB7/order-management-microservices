import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Iniciar la aplicación principal HTTP
  const app = await NestFactory.create(AppModule);

  // Configuración de Swagger para la documentación de la API
  const config = new DocumentBuilder()
    .setTitle('Order Management API')
    .setDescription('API para la gestión de pedidos y usuarios')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Configurar la conexión con RabbitMQ para comunicación con notification-service
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@rabbitmq:5672'], // URL de RabbitMQ
      queue: 'notifications_queue', // Cola para los mensajes de notificaciones
      queueOptions: {
        durable: false,
      },
    },
  });

  // Iniciar el microservicio
  await app.startAllMicroservices();
  
  // Iniciar la API HTTP en el puerto 3000
  await app.listen(3000);
  console.log('🚀 Order Management Service is running on http://localhost:3000');
}
bootstrap();
