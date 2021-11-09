export interface MarketData {
    federalFundsRate: number;
    sectorPerformances: SectorPerformance[];
    recessionProbability: number;
    // earnings: Earnings;
    crypto: Crypt;
    instFunds: number;
    nasdaq: IndexQuote;
    sp500: IndexQuote;
    dow: IndexQuote;
    russell: IndexQuote;
}

export interface IndexQuote {
    change: number;
    changePercent: number;
}

export interface SectorPerformance {
    type: string;
    name: string;
    performance: number;
    lastUpdated: Date;
}

export interface Crypt {
    symbol: string;
    price: number;
}

// export interface Earnings {
//     amc: EarningsRelease[];
//     bto: EarningsRelease[];
//     other: EarningsRelease[];
// }

// export interface EarningsRelease {
//     actualEPS:	number;
//     consensusEPS:	number;
//     announceTime:	string;
//     numberOfEstimates:	number;
//     EPSSurpriseDollar:	number;
//     EPSReportDate:	string;
//     fiscalPeriod:	string;	
//     fiscalEndDate:	string;
//     yearAgo:	number;
//     yearAgoChangePercent:	number;
//     estimatedChangePercent:	number;
//     symbol:	string;
//     quote:	object;
// }
