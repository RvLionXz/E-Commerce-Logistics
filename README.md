# EcoLog Backend API

A complete backend API for an e-commerce and logistics website built with Node.js, Express, and MySQL.

## Features

- User authentication (register/login)
- Product management (CRUD operations)
- Shopping cart functionality
- Order processing
- Shipment tracking with unique tracking codes
- Admin dashboard with statistics

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ecolog-backend
   
2. Install dependencies:
```shellscript
npm install
```

3. Set up the MySQL database:

```shellscript
mysql -u root -p  &lt; ecolog.sql
```

4. 4. Start the development server:

```shellscript
npm run dev
```




## API Endpoints

### Authentication

#### Register a new user

- **URL**: `/api/users/register`
- **Method**: `POST`
- **Request Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```


- **Response**:

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "message": "User registered successfully"
}
```




#### Login user

- **URL**: `/api/users/login`
- **Method**: `POST`
- **Request Body**:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```


- **Response**:

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "isAdmin": false,
  "message": "Login successful"
}
```




### User Management

#### Get user profile

- **URL**: `/api/users/profile`
- **Method**: `GET`
- **Headers**: `user-id: <user_id>`
- **Response**:

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2025-05-22T17:07:40.000Z"
}
```




#### Update user profile

- **URL**: `/api/users/profile`
- **Method**: `PUT`
- **Headers**: `user-id: <user_id>`
- **Request Body**:

```json
{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```


- **Response**:

```json
{
  "message": "Profile updated successfully"
}
```




#### Get all users (Admin only)

- **URL**: `/api/users`
- **Method**: `GET`
- **Headers**: `user-id: <admin_user_id>`
- **Response**:

```json
[
  {
    "id": 1,
    "name": "admin",
    "email": "admin@a.com",
    "created_at": "2025-05-22T17:07:40.000Z"
  },
  {
    "id": 2,
    "name": "Reval Mulia",
    "email": "reval@example.com",
    "created_at": "2025-05-22T17:13:11.000Z"
  }
]
```




### Product Management

#### Get all products

- **URL**: `/api/products`
- **Method**: `GET`
- **Response**:

```json
[
  {
    "id": 1,
    "name": "Sepatu Sneakers",
    "description": "Sepatu sneakers nyaman untuk sehari-hari",
    "price": "350000.00",
    "stock": 50,
    "image_url": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/396353/02/sv01/fnd/IDN/fmt/png/Sepatu-Sneaker-Unisex-dengan-Formstrip-Vulkanisasi-Court-Classic",
    "created_at": "2025-05-22T17:13:11.000Z"
  },
  {
    "id": 2,
    "name": "Kaos Polos",
    "description": "Kaos polos bahan katun berkualitas",
    "price": "75000.00",
    "stock": 100,
    "image_url": "https://images.tokopedia.net/img/cache/500-square/product-1/2020/10/16/44177218/44177218_8d4d1bcb-c962-467b-b3ab-aba2d8110201_1200_1200",
    "created_at": "2025-05-22T17:13:11.000Z"
  }
]
```




#### Get product by ID

- **URL**: `/api/products/:id`
- **Method**: `GET`
- **Response**:

```json
{
  "id": 1,
  "name": "Sepatu Sneakers",
  "description": "Sepatu sneakers nyaman untuk sehari-hari",
  "price": "350000.00",
  "stock": 50,
  "image_url": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/396353/02/sv01/fnd/IDN/fmt/png/Sepatu-Sneaker-Unisex-dengan-Formstrip-Vulkanisasi-Court-Classic",
  "created_at": "2025-05-22T17:13:11.000Z"
}
```




#### Create new product (Admin only)

- **URL**: `/api/products`
- **Method**: `POST`
- **Headers**: `user-id: <admin_user_id>`
- **Request Body**:

```json
{
  "name": "Tas Ransel",
  "description": "Tas ransel untuk sekolah dan kuliah",
  "price": 250000,
  "stock": 25,
  "image_url": "https://example.com/tas-ransel.jpg"
}
```


- **Response**:

```json
{
  "id": 4,
  "name": "Tas Ransel",
  "description": "Tas ransel untuk sekolah dan kuliah",
  "price": 250000,
  "stock": 25,
  "image_url": "https://example.com/tas-ransel.jpg",
  "message": "Product created successfully"
}
```




#### Update product (Admin only)

- **URL**: `/api/products/:id`
- **Method**: `PUT`
- **Headers**: `user-id: <admin_user_id>`
- **Request Body**:

```json
{
  "name": "Tas Ransel Premium",
  "description": "Tas ransel premium untuk sekolah dan kuliah",
  "price": 300000,
  "stock": 20,
  "image_url": "https://example.com/tas-ransel-premium.jpg"
}
```


- **Response**:

```json
{
  "message": "Product updated successfully"
}
```




#### Delete product (Admin only)

- **URL**: `/api/products/:id`
- **Method**: `DELETE`
- **Headers**: `user-id: <admin_user_id>`
- **Response**:

```json
{
  "message": "Product deleted successfully"
}
```




### Shopping Cart

#### Get user's cart

- **URL**: `/api/cart`
- **Method**: `GET`
- **Headers**: `user-id: <user_id>`
- **Response**:

```json
{
  "items": [
    {
      "id": 1,
      "quantity": 2,
      "product_id": 1,
      "name": "Sepatu Sneakers",
      "price": "350000.00",
      "image_url": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/396353/02/sv01/fnd/IDN/fmt/png/Sepatu-Sneaker-Unisex-dengan-Formstrip-Vulkanisasi-Court-Classic",
      "total_price": "700000.00"
    },
    {
      "id": 2,
      "quantity": 1,
      "product_id": 3,
      "name": "Jaket Hoodie",
      "price": "200000.00",
      "image_url": "https://cutoff.id/cdn/shop/files/SMOKEGREEN.jpg?v=1701741238",
      "total_price": "200000.00"
    }
  ],
  "total": 900000
}
```




#### Add item to cart

- **URL**: `/api/cart/add`
- **Method**: `POST`
- **Headers**: `user-id: <user_id>`
- **Request Body**:

```json
{
  "productId": 1,
  "quantity": 2
}
```


- **Response**:

```json
{
  "message": "Item added to cart successfully"
}
```




#### Update cart item quantity

- **URL**: `/api/cart/:id`
- **Method**: `PUT`
- **Headers**: `user-id: <user_id>`
- **Request Body**:

```json
{
  "quantity": 3
}
```


- **Response**:

```json
{
  "message": "Cart item updated successfully"
}
```




#### Remove item from cart

- **URL**: `/api/cart/:id`
- **Method**: `DELETE`
- **Headers**: `user-id: <user_id>`
- **Response**:

```json
{
  "message": "Item removed from cart successfully"
}
```




#### Clear cart

- **URL**: `/api/cart`
- **Method**: `DELETE`
- **Headers**: `user-id: <user_id>`
- **Response**:

```json
{
  "message": "Cart cleared successfully"
}
```




### Orders

#### Create new order from cart

- **URL**: `/api/orders`
- **Method**: `POST`
- **Headers**: `user-id: <user_id>`
- **Response**:

```json
{
  "orderId": 12,
  "trackingCode": "RESI-AB12CD34",
  "totalAmount": 900000,
  "message": "Order created successfully"
}
```




#### Get user's orders

- **URL**: `/api/orders/user`
- **Method**: `GET`
- **Headers**: `user-id: <user_id>`
- **Response**:

```json
[
  {
    "id": 11,
    "user_id": 1,
    "total_amount": null,
    "status": "pending",
    "created_at": "2025-05-22T21:25:02.000Z",
    "tracking_code": "RESI-ORI5UCZO0"
  },
  {
    "id": 12,
    "user_id": 1,
    "total_amount": "900000.00",
    "status": "pending",
    "created_at": "2025-05-23T10:15:30.000Z",
    "tracking_code": "RESI-AB12CD34"
  }
]
```




#### Get order by ID

- **URL**: `/api/orders/:id`
- **Method**: `GET`
- **Headers**: `user-id: <user_id>`
- **Response**:

```json
{
  "id": 11,
  "user_id": 1,
  "total_amount": null,
  "status": "pending",
  "created_at": "2025-05-22T21:25:02.000Z",
  "tracking_code": "RESI-ORI5UCZO0",
  "items": [
    {
      "id": 20,
      "order_id": 11,
      "product_id": 3,
      "quantity": 1,
      "price": "200000.00",
      "name": "Jaket Hoodie",
      "image_url": "https://cutoff.id/cdn/shop/files/SMOKEGREEN.jpg?v=1701741238"
    },
    {
      "id": 21,
      "order_id": 11,
      "product_id": 1,
      "quantity": 1,
      "price": "350000.00",
      "name": "Sepatu Sneakers",
      "image_url": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/396353/02/sv01/fnd/IDN/fmt/png/Sepatu-Sneaker-Unisex-dengan-Formstrip-Vulkanisasi-Court-Classic"
    }
  ],
  "shipmentTraces": []
}
```




#### Get all orders (Admin only)

- **URL**: `/api/orders`
- **Method**: `GET`
- **Headers**: `user-id: <admin_user_id>`
- **Response**:

```json
[
  {
    "id": 1,
    "user_id": 2,
    "total_amount": "925000.00",
    "status": "pending",
    "created_at": "2025-05-22T17:13:11.000Z",
    "user_name": "Reval Mulia",
    "user_email": "reval@example.com",
    "tracking_code": "TRK123456789"
  },
  {
    "id": 2,
    "user_id": 3,
    "total_amount": "375000.00",
    "status": "paid",
    "created_at": "2025-05-22T17:13:11.000Z",
    "user_name": "Siti Aminah",
    "user_email": "siti@example.com",
    "tracking_code": "TRK987654321"
  }
]
```




#### Update order status (Admin only)

- **URL**: `/api/orders/:id/status`
- **Method**: `PUT`
- **Headers**: `user-id: <admin_user_id>`
- **Request Body**:

```json
{
  "status": "shipped"
}
```


- **Response**:

```json
{
  "message": "Order status updated successfully"
}
```




### Shipments

#### Track shipment by tracking code

- **URL**: `/api/shipments/track/:trackingCode`
- **Method**: `GET`
- **Response**:

```json
{
  "id": 1,
  "order_id": 1,
  "tracking_code": "TRK123456789",
  "courier_name": "JNE",
  "created_at": "2025-05-22T17:13:11.000Z",
  "order_status": "pending",
  "order_date": "2025-05-22T17:13:11.000Z",
  "items": [
    {
      "id": 1,
      "order_id": 1,
      "product_id": 1,
      "quantity": 2,
      "price": "350000.00",
      "name": "Sepatu Sneakers",
      "image_url": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/396353/02/sv01/fnd/IDN/fmt/png/Sepatu-Sneaker-Unisex-dengan-Formstrip-Vulkanisasi-Court-Classic"
    },
    {
      "id": 2,
      "order_id": 1,
      "product_id": 3,
      "quantity": 1,
      "price": "200000.00",
      "name": "Jaket Hoodie",
      "image_url": "https://cutoff.id/cdn/shop/files/SMOKEGREEN.jpg?v=1701741238"
    }
  ]
}
```




#### Get shipment traces

- **URL**: `/api/shipments/track/:trackingCode/traces`
- **Method**: `GET`
- **Response**:

```json
[
  {
    "id": 2,
    "shipment_id": 1,
    "status": "Paket dalam proses pengiriman",
    "updated_at": "2025-05-22T17:13:11.000Z"
  },
  {
    "id": 1,
    "shipment_id": 1,
    "status": "Paket diterima di gudang",
    "updated_at": "2025-05-22T17:13:11.000Z"
  }
]
```




#### Get all shipments (Admin only)

- **URL**: `/api/shipments`
- **Method**: `GET`
- **Headers**: `user-id: <admin_user_id>`
- **Response**:

```json
[
  {
    "id": 1,
    "order_id": 1,
    "tracking_code": "TRK123456789",
    "courier_name": "JNE",
    "created_at": "2025-05-22T17:13:11.000Z",
    "order_status": "pending",
    "order_date": "2025-05-22T17:13:11.000Z",
    "user_name": "Reval Mulia"
  },
  {
    "id": 2,
    "order_id": 2,
    "tracking_code": "TRK987654321",
    "courier_name": "TIKI",
    "created_at": "2025-05-22T17:13:11.000Z",
    "order_status": "paid",
    "order_date": "2025-05-22T17:13:11.000Z",
    "user_name": "Siti Aminah"
  }
]
```




#### Create shipment trace (Admin only)

- **URL**: `/api/shipments/:id/trace`
- **Method**: `POST`
- **Headers**: `user-id: <admin_user_id>`
- **Request Body**:

```json
{
  "status": "Paket telah tiba di kota tujuan"
}
```


- **Response**:

```json
{
  "message": "Shipment trace created successfully"
}
```




### Admin Dashboard

#### Check admin status

- **URL**: `/api/admin/status`
- **Method**: `GET`
- **Headers**: `user-id: <user_id>`
- **Response**:

```json
{
  "isAdmin": true
}
```




#### Get dashboard statistics (Admin only)

- **URL**: `/api/admin/dashboard`
- **Method**: `GET`
- **Headers**: `user-id: <admin_user_id>`
- **Response**:

```json
{
  "totalUsers": 5,
  "totalProducts": 3,
  "totalOrders": 3,
  "totalRevenue": "375000.00",
  "recentOrders": [
    {
      "id": 11,
      "user_id": 1,
      "total_amount": null,
      "status": "pending",
      "created_at": "2025-05-22T21:25:02.000Z",
      "user_name": "admin",
      "user_email": "admin@a.com"
    },
    {
      "id": 2,
      "user_id": 3,
      "total_amount": "375000.00",
      "status": "paid",
      "created_at": "2025-05-22T17:13:11.000Z",
      "user_name": "Siti Aminah",
      "user_email": "siti@example.com"
    },
    {
      "id": 1,
      "user_id": 2,
      "total_amount": "925000.00",
      "status": "pending",
      "created_at": "2025-05-22T17:13:11.000Z",
      "user_name": "Reval Mulia",
      "user_email": "reval@example.com"
```


## Database Schema

The database consists of the following tables:

- **users**: Stores user information
- **admins**: Links users to admin roles
- **products**: Stores product information
- **cart**: Stores items in users' shopping carts
- **orders**: Stores order information
- **order_items**: Stores items within orders
- **shipments**: Stores shipment information with tracking codes
- **shipment_traces**: Stores shipment status updates

