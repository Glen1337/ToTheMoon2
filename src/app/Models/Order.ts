export interface Order {
    price: number;
    quantity: number;
    transactionDate?: Date;
    portfolioId: number;
    orderId: number;
    symbol: string;
    orderType: string;
    securityType: string;
}
