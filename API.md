_GET /status_

_GET /categories_

_GET /products_

_GET /products/:UUID_

_POST /products_
```
{
    "name": "example2",
    "description": "This is a sample product description.",
    "price": 369.99,
    "weight": 15.99,
    "categoryName": "Books",
    "stock": 10
}
```
_PUT /products:UUID_
```
{
    "name": "example2",
    "description": "This is a sample product description.",
    "price": 369.99,
    "weight": 15.99,
    "categoryName": "Books",
    "stock": 10
}
```
_GET /orders_

_GET /orders/:UUID_

_POST /orders_
```
{
    "username": "john doe",
    "email": "john.doe@example.com",
    "phone": "1234567890",
    "products": [
        {
            "id": "UUID",
            "quantity": 1
        },
        {
            "id": "UUID",
            "quantity": 3
        }
    ]
}
```
_PUT /orders/:id <- only ORDER entity_
```
{
  "username": "Updated User",
  "email": "updated.email@example.com",
  "phone": "1234567890",
  "statusName": "UNCONFIRMED"
}
```
_GET /orders/status/:statusNAME_
```UNCOMFIRMED CONFIRMED COMPLETED CANCELLED```
PUT /orders/:orderUUID/products/:productUUID <- edit product stock in the eorder
```
{
  "quantity": 80
}
```
_DELETE /orders/:orderUUID/products/:productUUID_ <- entirelly remove product from the order


