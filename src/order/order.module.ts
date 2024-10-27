import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductOrder } from 'src/product-order/entities/product-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, ProductOrder])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
