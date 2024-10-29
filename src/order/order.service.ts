import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductOrder } from 'src/product-order/entities/product-order.entity';
import { Status } from 'src/status/entities/status.entity';
import { UpdateProductOrderDto } from 'src/product-order/dto/update-product-order.dto';

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

    @InjectRepository(ProductOrder)
    private productOrderRepository: Repository<ProductOrder>,
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
    if ((orderDto as any).id) {
      throw new BadRequestException('Updating the primary key "id" is not allowed');
    }


    if (!orderDto.products || orderDto.products.length === 0) {
      throw new BadRequestException('Order must contain at least one product');
    }


    const defaultStatus = await this.statusRepository.findOne({
      where: { name: 'UNCONFIRMED' },
    });

    if (!defaultStatus) {
      throw new InternalServerErrorException('Default status "UNCONFIRMED" is missing from the database');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      const order = new Order();
      order.approvalDate = null; // Initial approval date is null
      order.username = orderDto.username;
      order.email = orderDto.email;
      order.phone = orderDto.phone;
      order.status = defaultStatus;

      const savedOrder = await queryRunner.manager.save(order);
  
      

      for (const item of orderDto.products) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.id },
          lock: { mode: 'pessimistic_write' }, // Ensures exclusive access
        });
  
        if (!product) throw new Error(`Product with ID ${item.id} not found`);
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ID ${item.id}`);
        }
  
        product.stock -= item.quantity;
        await queryRunner.manager.save(product);
  
        const productOrder = new ProductOrder();
        productOrder.order = savedOrder;
        productOrder.product = product;
        productOrder.quantity = item.quantity;
  
        await queryRunner.manager.save(productOrder);
      }
  
      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`Failed to create order: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async findAllOrders(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['productOrders', 'productOrders.product', 'status'] });
  }

  async findById(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['productOrders', 'productOrders.product', 'status'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID "${orderId}" not found`);  // usunac ""
    }

    return order;
  }

  async findOrdersByStatusName(statusName: string): Promise<Order[]> {
    const status = await this.statusRepository.findOne({ where: { name: statusName } });

    if (!status) {
      throw new NotFoundException(`Status with name "${statusName}" not found`);
    }

    const orders = await this.orderRepository.find({
      where: { status },
      relations: ['productOrders', 'productOrders.product', 'status'],
    });

    if (orders.length === 0) {
      throw new NotFoundException(`No orders found with status "${statusName}"`);
    }

    return orders;
  }

  async removeProductFromOrder(orderId: string, productId: string): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['status'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID "${orderId}" not found`);
    }

    if (order.status.name !== 'UNCONFIRMED') {
      throw new BadRequestException(`Cannot modify order with status "${order.status.name}". Only orders with "UNCONFIRMED" status can be modified.`);
    }

    const productOrder = await this.productOrderRepository.findOne({
      where: { order: { id: orderId }, product: { id: productId } },
      relations: ['order', 'product'],
    });

    if (!productOrder) {
      throw new NotFoundException(`Product with ID "${productId}" in order ID "${orderId}" not found`);
    }

    await this.productOrderRepository.remove(productOrder);

    const updatedOrder = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['productOrders'],
    });

    if (!updatedOrder.productOrders || updatedOrder.productOrders.length === 0) {
      const cancelledStatus = await this.statusRepository.findOne({
        where: { name: 'CANCELLED' },
      });

      if (!cancelledStatus) {
        throw new InternalServerErrorException('Status "CANCELLED" is missing from the database');
      }

      updatedOrder.status = cancelledStatus;
      await this.orderRepository.save(updatedOrder);
    }
  }

  async updateProductQuantityInOrder(orderId: string, productId: string, quantity: number): Promise<void> {
    if ((UpdateProductOrderDto as any).id) {
      throw new BadRequestException('Updating the primary key "id" is not allowed');
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const order = await queryRunner.manager.findOne(Order, {
            where: { id: orderId },
            relations: ['status'],
            lock: { mode: 'pessimistic_write' },
        });

        if (!order) {
            throw new NotFoundException(`Order with ID "${orderId}" not found`);
        }

        if (order.status.name !== 'UNCONFIRMED') {
            throw new BadRequestException(`Cannot modify order with status "${order.status.name}". Only orders with "UNCONFIRMED" status can be modified.`);
        }

        const productOrder = await queryRunner.manager.findOne(ProductOrder, {
            where: { order: { id: orderId }, product: { id: productId } },
            relations: ['product'],
            lock: { mode: 'pessimistic_write' },
        });

        if (!productOrder) {
            throw new NotFoundException(`Product with ID "${productId}" in order ID "${orderId}" not found`);
        }

        const currentQuantity = productOrder.quantity;
        const quantityDifference = quantity - currentQuantity;

        if (quantityDifference > 0 && productOrder.product.stock < quantityDifference) {
            throw new BadRequestException(`Insufficient stock for product ID ${productId} to adjust quantity to ${quantity}`);
        }

        productOrder.quantity = quantity;
        await queryRunner.manager.save(productOrder);

        productOrder.product.stock -= quantityDifference;
        await queryRunner.manager.save(productOrder.product);

        await queryRunner.commitTransaction();
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException(`Failed to update product quantity: ${error.message}`);
    } finally {
        await queryRunner.release();
    }
  }

  private isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
    const validTransitions = {
      UNCONFIRMED: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: [],
    };

    return validTransitions[currentStatus]?.includes(newStatus) ?? false;
  }

  async updateOrder(orderId: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    if ((updateOrderDto as any).id) {
      throw new BadRequestException('Updating the primary key "id" is not allowed');
    }

    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['status'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID "${orderId}" not found`);
    }

    if (updateOrderDto.statusName !== undefined) {
      const newStatus = await this.statusRepository.findOne({
        where: { name: updateOrderDto.statusName },
      });

      if (!newStatus) {
        throw new NotFoundException(`Status "${updateOrderDto.statusName}" not found`);
      }

      if (!this.isValidStatusTransition(order.status.name, newStatus.name)) {
        throw new BadRequestException(
          `Invalid status transition from "${order.status.name}" to "${newStatus.name}"`,
        );
      }

      if (newStatus.name === 'CONFIRMED') {
        order.approvalDate = new Date();
      }


      order.status = newStatus;

      
    }

    if (updateOrderDto.username !== undefined) {
      order.username = updateOrderDto.username;
    }

    if (updateOrderDto.email !== undefined) {
      order.email = updateOrderDto.email;
    }

    if (updateOrderDto.phone !== undefined) {
      order.phone = updateOrderDto.phone;
    }

    return await this.orderRepository.save(order);
  }


}
