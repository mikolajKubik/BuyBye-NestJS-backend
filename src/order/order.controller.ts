import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

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
  
}
