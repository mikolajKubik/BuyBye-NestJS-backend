import { ProductOrder } from "src/product-order/entities/product-order.entity";
import { Status } from "src/status/entities/status.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    orderDate: Date;

    @OneToMany(() => ProductOrder, (productOrder) => productOrder.order)
    productOrders: ProductOrder[];

    @ManyToOne(() => Status, (status) => status.orders, { nullable: false })
    status: Status;

    
}
