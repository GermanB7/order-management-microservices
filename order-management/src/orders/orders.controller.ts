import { Controller, Post, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Orders') // 👈 Agrupa los endpoints en Swagger
@ApiBearerAuth() // 👈 Indica que estos endpoints requieren autenticación
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Crear un pedido' })
  @ApiResponse({ status: 201, description: 'Pedido creado exitosamente' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Body() body: { userId: string }) {
    return this.ordersService.createOrder(body.userId);
  }

  @ApiOperation({ summary: 'Obtener pedidos de un usuario' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos' })
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async getOrders(@Param('userId') userId: string) {
    return this.ordersService.getOrdersByUser(userId);
  }

  @ApiOperation({ summary: 'Actualizar estado de un pedido' })
  @ApiResponse({ status: 200, description: 'Estado del pedido actualizado' })
  @UseGuards(JwtAuthGuard)
  @Patch(':orderId')
  async updateOrderStatus(@Param('orderId') orderId: string, @Body() body: { status: string }) {
    return this.ordersService.updateOrderStatus(orderId, body.status);
  }
}
