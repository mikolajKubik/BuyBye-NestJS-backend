import { Module } from '@nestjs/common';
import { ProductOrderService } from './product-order.service';
import { ProductOrderController } from './product-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrder } from './entities/product-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrder])],
  //controllers: [ProductOrderController],
  //providers: [ProductOrderService],
})
export class ProductOrderModule {}
