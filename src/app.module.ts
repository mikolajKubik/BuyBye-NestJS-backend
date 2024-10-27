import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order/entities/order.entity';
import { Product } from './product/entities/product.entity';
import { ProductOrder } from './product-order/entities/product-order.entity';
import { ProductOrderModule } from './product-order/product-order.module';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/category.entity';
import { StatusModule } from './status/status.module';
import { Status } from './status/entities/status.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'aji-user',
      password: 'your_password',
      database: 'aji-db',
      entities: [Order, Product, ProductOrder, Category, Status],
      synchronize: true,
      
    }),
    OrderModule, 
    ProductModule,
    ProductOrderModule,
    CategoryModule,
    StatusModule
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
