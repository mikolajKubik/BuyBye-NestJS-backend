import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductOrder } from 'src/product-order/entities/product-order.entity';
import { Status } from 'src/status/entities/status.entity';
import { UpdateProductOrderDto } from 'src/product-order/dto/update-product-order.dto';
import { NotFoundApplicationException } from 'src/excpetion/not-found-application.exception';
import { InvalidRequestApplicationException } from 'src/excpetion/invalid-request-application.exception';
import { DatabaseException } from 'src/excpetion/database.exception';

@Injectable()
export class OrderService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(Status)
    private statusRepository: Repository<Status>,

    @InjectRepository(ProductOrder)
    private productOrderRepository: Repository<ProductOrder>,
  ) {}

  async findAllOrders(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['productOrders', 'productOrders.product', 'status'] });
  }

  async createOrderWithProducts(orderDto: CreateOrderDto): Promise<Order> {
   
    if (!orderDto.products || orderDto.products.length === 0) {
      throw new InvalidRequestApplicationException(
        "Order must contain at least one product",
        "/orders"
      )
    }

    const defaultStatus = await this.statusRepository.findOne({
      where: { name: 'UNCONFIRMED' },
    });

    if (!defaultStatus) {
      throw new DatabaseException(
        'Status "UNCONFIRMED" is missing from the database',
        '/status/UNCONFIRMED'
      )
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
  
        if (!product) {
          throw new NotFoundApplicationException(
            `Product with ID "${item.id}" not found`,
            `/products/${item.id}`
          )
        }
        if (product.stock < item.quantity) {
          throw new InvalidRequestApplicationException(
            `Insufficient stock for product ID ${item.id} to add quantity ${item.quantity}`,
            `/products/${item.id}`
          )
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
      throw new DatabaseException(
        `Failed to create order: ${error.message}`,
        '/orders'
      )
    } finally {
      await queryRunner.release();
    }
  }

  async findOrdersByUsername(username: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { username },
      relations: ['productOrders', 'productOrders.product', 'status'],
    });
  }

  async updateOrder(orderId: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['status'],
    });

    if (!order) {
      throw new NotFoundApplicationException(
        `Order with ID "${orderId}" not found`,
        `/orders/${orderId}`
      )
    }

    if (updateOrderDto.statusName !== undefined) {
      const newStatus = await this.statusRepository.findOne({
        where: { name: updateOrderDto.statusName },
      });

      if (!newStatus) {
        throw new NotFoundApplicationException(
          `Status with name "${updateOrderDto.statusName}" not found`,
          `/statuses/${updateOrderDto.statusName}`
        )
      }

      if (!this.isValidStatusTransition(order.status.name, newStatus.name)) {
        throw new InvalidRequestApplicationException(
          `Invalid status transition from "${order.status.name}" to "${newStatus.name}"`,
          `/orders/${orderId}`
        )
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

  async findOrdersByStatusName(statusName: string): Promise<Order[]> {
    const status = await this.statusRepository.findOne({ where: { name: statusName } });

    if (!status) {
      throw new NotFoundApplicationException(
        `Status with name "${statusName}" not found`,
        `/status/${statusName}`
      )
    }

    const orders = await this.orderRepository.find({
      where: { status },
      relations: ['productOrders', 'productOrders.product', 'status'],
    });

    return orders;
  }

  async findById(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['productOrders', 'productOrders.product', 'status'],
    });

    if (!order) {
      throw new NotFoundApplicationException(
        `Order with ID "${orderId}" not found`,
        `/orders/${orderId}`
      )
    }

    return order;
  }

  async removeProductFromOrder(orderId: string, productId: string): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['status'],
    });

    if (!order) {
      throw new NotFoundApplicationException(
        `Order with ID "${orderId}" not found`,
        `/orders/${orderId}`
      )
    }

    if (order.status.name !== 'UNCONFIRMED') {
      throw new InvalidRequestApplicationException(
        `Cannot modify order with status "${order.status.name}". Only orders with "UNCONFIRMED" status can be modified.`,
        `/orders/${orderId}`
      )
    }

    const productOrder = await this.productOrderRepository.findOne({
      where: { order: { id: orderId }, product: { id: productId } },
      relations: ['order', 'product'],
    });

    if (!productOrder) {
      throw new NotFoundApplicationException(
        `Product with ID "${productId}" in order ID "${orderId}" not found`,
        `/orders/${orderId}`
      )
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
        throw new DatabaseException(
          'Status "CANCELLED" is missing from the database',
          '/status/CANCELLED'
        )
      }

      updatedOrder.status = cancelledStatus;
      await this.orderRepository.save(updatedOrder);
    }
  }

  async updateProductQuantityInOrder(orderId: string, productId: string, quantity: number): Promise<void> {

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
            throw new NotFoundApplicationException(
                `Order with ID "${orderId}" not found`,
                `/orders/${orderId}`
            )
        }

        if (order.status.name !== 'UNCONFIRMED') {
            throw new InvalidRequestApplicationException(
                `Cannot modify order with status "${order.status.name}". Only orders with "UNCONFIRMED" status can be modified.`,
                `/orders/${orderId}`
            )
        }

        const productOrder = await queryRunner.manager.findOne(ProductOrder, {
            where: { order: { id: orderId }, product: { id: productId } },
            relations: ['product'],
            lock: { mode: 'pessimistic_write' },
        });

        if (!productOrder) {
            throw new NotFoundApplicationException(
                `Product with ID "${productId}" in order ID "${orderId}" not found`,
                `/orders/${orderId}`
            )
        }

        const currentQuantity = productOrder.quantity;
        const quantityDifference = quantity - currentQuantity;

        if (quantityDifference > 0 && productOrder.product.stock < quantityDifference) {
            throw new InvalidRequestApplicationException(
                `Insufficient stock for product ID ${productId} to add quantity ${quantityDifference}`,
                `/products/${productId}`
            )
        }

        productOrder.quantity = quantity;
        await queryRunner.manager.save(productOrder);

        productOrder.product.stock -= quantityDifference;
        await queryRunner.manager.save(productOrder.product);

        await queryRunner.commitTransaction();
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new DatabaseException(
            `Failed to update product quantity in order: ${error.message}`,
            `/orders/${orderId}`
        )
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
}
