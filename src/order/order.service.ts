import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductOrder } from 'src/product-order/entities/product-order.entity';
import { Status } from 'src/status/entities/status.entity';

@Injectable()
export class OrderService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(Status)
    private statusRepository: Repository<Status>,

    // @InjectRepository(Product)
    // private productRepository: Repository<Product>,

    // @InjectRepository(ProductOrder)
    // private productOrderRepository: Repository<ProductOrder>,
  ) {}

  // async createOrderWithProducts(orderDto: { orderDate: Date; products: { id: string; quantity: number }[] }): Promise<Order> {
  //   const order = new Order();
  //   order.orderDate = orderDto.orderDate;
    
  //   const savedOrder = await this.orderRepository.save(order);

  //   for (const item of orderDto.products) {
  //     const product = await this.productRepository.findOne({ where: { id: item.id } });
  //     if (!product) throw new Error(`Product with ID ${item.id} not found`);

  //     const productOrder = new ProductOrder();
  //     productOrder.order = savedOrder;
  //     productOrder.product = product;
  //     productOrder.quantity = item.quantity;

  //     await this.productOrderRepository.save(productOrder);
  //   }

  //   return savedOrder;
  // }

  async createOrderWithProducts(orderDto: CreateOrderDto): Promise<Order> {
    //Step 0: Get status
    const status = await this.statusRepository.findOne({
      where: { name: orderDto.statusName },
    });

    if (!status) {
      throw new NotFoundException(`Category with name "${orderDto.statusName}" not found`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      // Step 1: Create the order
      const order = new Order();
      order.orderDate = orderDto.orderDate;
      const savedOrder = await queryRunner.manager.save(order);
  
      // Step 2: Loop through products and create ProductOrder entries
      for (const item of orderDto.products) {
        // Use a pessimistic write lock when retrieving the product
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.id },
          lock: { mode: 'pessimistic_write' }, // Ensures exclusive access
        });
  
        if (!product) throw new Error(`Product with ID ${item.id} not found`);
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ID ${item.id}`);
        }
  
        // Deduct stock and save the product
        product.stock -= item.quantity;
        await queryRunner.manager.save(product);
  
        // Create and save ProductOrder entry
        const productOrder = new ProductOrder();
        productOrder.order = savedOrder;
        productOrder.product = product;
        productOrder.quantity = item.quantity;
  
        await queryRunner.manager.save(productOrder);
      }
  
      // Step 3: Commit the transaction if everything succeeds
      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      // Step 4: Rollback the transaction on error
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`Failed to create order: ${error.message}`);
    } finally {
      // Step 5: Release the query runner after transaction
      await queryRunner.release();
    }
  }

  async findAllOrders(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['productOrders', 'productOrders.product'] });
  }


}
