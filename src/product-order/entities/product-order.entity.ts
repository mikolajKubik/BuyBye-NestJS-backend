import { Order } from "src/order/entities/order.entity";
import { Product } from "src/product/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductOrder {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    quantity: number;

    @ManyToOne(() => Product, (product) => product.productOrders)
    product: Product;

    @ManyToOne(() => Order, (order) => order.productOrders)
    order: Order;
}
