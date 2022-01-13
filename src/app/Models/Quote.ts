
export interface Trade {
    symbol: string;
    timestampUtc: Date;
    exchange: string;
    price: number;
    size: number;
    tape: string;
    tradeId: number;
    conditions: string[];
}