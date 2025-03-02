import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // 👈 Cargar variables del .env
    AuthModule,
    UsersModule,
    OrdersModule,
  ],
})
export class AppModule {}
