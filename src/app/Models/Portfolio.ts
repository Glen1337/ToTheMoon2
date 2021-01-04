import { Holding } from './Holding';
import { Order } from './Order';

export interface Portfolio {
    title: string;
    totalMarketValue: number;
    creationDate?: Date;
    type: string;
    portfolioId: number;
    gainLoss: number;
    holdings: Holding[];
    orders: Order[];
}