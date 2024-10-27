import { ProductOrder } from "src/product-order/entities/product-order.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    stock: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @OneToMany(() => ProductOrder, (productOrder) => productOrder.product)
    productOrders: ProductOrder[];
}
