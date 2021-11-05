export interface Option {
    ask: number;
    bid: number;
    closingPrice: number;
    contractSize: number;
    expirationDate: string;
    id: string;
    isAdjusted: boolean;
    lastUpdated: Date;
    openInterest: number;
    side: string;
    strikePrice: number;
    symbol: string;
    type: string;
    volume: number;
}

export interface RefOption {
    symbol: string;
    date: string;
    name: string;
    description: string;
    expirationDate: string;
    type: string;
    side: string;
    exerciseStyle: string;
    strike: number;
    underlying: string;
    region: string;
    currency: string;
    contractSize: number;
    exchange: string;
    exchangeName: string;
}
