import { ProductOrder } from "src/product-order/entities/product-order.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    orderDate: Date;

    @OneToMany(() => ProductOrder, (productOrder) => productOrder.order)
    productOrders: ProductOrder[];
}
