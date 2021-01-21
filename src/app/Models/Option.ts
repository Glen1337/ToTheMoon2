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
