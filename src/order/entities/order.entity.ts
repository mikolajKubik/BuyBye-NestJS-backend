import { ProductOrder } from "src/product-order/entities/product-order.entity";
import { Status } from "src/status/entities/status.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'datetime', nullable: true })
    approvalDate: Date | null;

    // @Column()
    // orderDate: Date;

    @Column({ type: 'varchar', length: 255, nullable: false })
    username: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    phone: string;

    @OneToMany(() => ProductOrder, (productOrder) => productOrder.order)
    productOrders: ProductOrder[];

    @ManyToOne(() => Status, (status) => status.orders, { nullable: false })
    status: Status;

    
}
