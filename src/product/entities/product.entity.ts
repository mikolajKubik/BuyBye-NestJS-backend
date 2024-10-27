import { Category } from "src/category/entities/category.entity";
import { ProductOrder } from "src/product-order/entities/product-order.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({ type: 'int', nullable: false })
    stock: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    weight: number;

    @OneToMany(() => ProductOrder, (productOrder) => productOrder.product)
    productOrders: ProductOrder[];

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;


}
