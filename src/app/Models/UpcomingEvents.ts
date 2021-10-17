export interface UpcomingEvents {
    ipo: Ipo[];
    earnings: EarningsReport[];
}

export interface Ipo {
    lockupPeriod: Date;
    managers: string;
    offeringDate: Date;
    offerPrice: number;
    priceRangeHigh: number;
    priceRangeLow: number;
    quietperiod: string;
    shares: bigint;
    status: string;
    symbol: string;
    updated?: Date;
    volume: bigint;
}

export interface EarningsReport {
    symbol: string;
    reportDate: Date;
}
