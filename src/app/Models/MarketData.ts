export interface MarketData {
    federalFundsRate: number;
    sectorPerformances: SectorPerformance[];
    recessionProbability: number;
    earnings: Earnings;
}

export interface SectorPerformance{
    type: string;
    name: string;
    performance: string;
    lastUpdated: Date;
    performancePercentage: number
}

export interface Earnings {
    amc: EarningsRelease[];
    bto: EarningsRelease[];
    other: EarningsRelease[];
}

export interface EarningsRelease {
    actualEPS:	number;
    consensusEPS:	number;
    announceTime:	string;
    numberOfEstimates:	number;
    EPSSurpriseDollar:	number;
    EPSReportDate:	string;
    fiscalPeriod:	string;	
    fiscalEndDate:	string;
    yearAgo:	number;
    yearAgoChangePercent:	number;
    estimatedChangePercent:	number;
    symbol:	string;
    quote:	object;
}
