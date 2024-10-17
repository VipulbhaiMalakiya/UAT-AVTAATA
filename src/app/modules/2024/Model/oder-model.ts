export interface Order {
    id: number;
    orderId: string;
    mobileNumber: string;
    customerName: string;
    orderDate: string;
    orderStatus: string;
    deliveryAddress: string;
    orderProducts: OrderProduct[];
}

export interface OrderProduct {
    productId: string;
    productName: string;
    productDescription: string;
    price: string;
    currency: string;
    imageLink: string;
    availability: string;
    quantity: number;
}