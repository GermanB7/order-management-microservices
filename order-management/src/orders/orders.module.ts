import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module'; // 👈 Importamos AuthModule

@Module({
  imports: [PrismaModule, AuthModule], // 👈 Agregamos AuthModule aquí
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
