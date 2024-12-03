import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ParseUUIDPipe, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { UpdateProductOrderDto } from 'src/product-order/dto/update-product-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAll(): Promise<Order[]> {
    return this.orderService.findAllOrders();
  }

  @Post()
  async createOrderWithProducts(
    @Body(ValidationPipe) createOrderDto: CreateOrderDto
  ): Promise<Order> {
    return this.orderService.createOrderWithProducts(createOrderDto);
  }

  @Put(':id')
  async updateOrder(
    @Param('id', ParseUUIDPipe) orderId: string,
    @Body(ValidationPipe) updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return await this.orderService.updateOrder(orderId, updateOrderDto);
  }

  @Get('status/:statusName')
  async findOrdersByStatusName(
    @Param('statusName') statusName: string,
  ): Promise<Order[]> {
    return this.orderService.findOrdersByStatusName(statusName);
  }

  @Get('username/:username')
  async findOrdersByUsername(
    @Param('username') username: string,
  ): Promise<Order[]> {
    return this.orderService.findOrdersByUsername(username);
  }

  @Get(':id')
  async findOrderById(
    @Param('id', ParseUUIDPipe) id: string, // Ensures `id` is a valid UUID
  ): Promise<Order> {
    return this.orderService.findById(id);
  }

  @Delete(':orderId/products/:productId')
  async removeProductFromOrder(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<void> {
    await this.orderService.removeProductFromOrder(orderId, productId);
  }

  @Put(':orderId/products/:productId')
  async updateProductQuantityInOrder(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body(ValidationPipe) updateProductOrderDto: UpdateProductOrderDto,
  ): Promise<void> {
    await this.orderService.updateProductQuantityInOrder(orderId, productId, updateProductOrderDto.quantity);
  }

}
