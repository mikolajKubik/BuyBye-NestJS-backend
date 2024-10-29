Table Product {
    id int [pk, increment] 
    name varchar(255)
    description text
    unit_price decimal(10, 2)
    unit_weight decimal(10, 2)
    stock int
    category_id int [ref: > Category.id]
}

Table Category {
    id int [pk, increment]
    name varchar(255)
}

Table Order {
    id int [pk, increment]
    approval_date datetime [null]
    status_id int [ref: > Status.id]
    username varchar(255)
    email varchar(255)
    phone varchar(50)
}

Table Order_Product {
    product_id int [ref: > Product.id]
    order_id int [ref: > Order.id]
    quantity int
}

Table Status {
    id int [pk, increment]
    name varchar(255)
}