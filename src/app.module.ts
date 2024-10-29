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
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';

// dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available throughout the app without importing it in other modules
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Product, Order, Status, ProductOrder, Category],
      synchronize: process.env.TYPEORM_SYNC === 'true',

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
