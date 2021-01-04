export interface Order {
    price: number;
    quantity: number;
    transactionDate: Date;
    action: string;
    portfolioId: number;
    orderId: number;
    symbol: string;
    orderType: string;
    securityType: string;
    userId: string
}
