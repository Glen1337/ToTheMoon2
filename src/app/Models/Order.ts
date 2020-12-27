export interface Order {
    price: number;
    quantity: number;
    transactionDate: Date;
    action: string;
    portfolioId: number;
}