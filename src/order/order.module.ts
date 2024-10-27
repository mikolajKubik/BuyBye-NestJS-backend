import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductOrder } from 'src/product-order/entities/product-order.entity';
import { Status } from 'src/status/entities/status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, ProductOrder, Status])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
