export interface CompanyResearch {
    logo: Logo;
    advStats: AdvancedStats;
    instOwnership: InstitutionalOwnership[];
}

export interface Logo{
    url: string;
}

export interface InstitutionalOwnership {
    reportedHolding: number;
    entityProperName: string;
}

export interface AdvancedStats {
    peLow: number;
    peHigh: number;
    pegRatio: number;
    forwardPERatio: number;
    priceToBook: number;
    priceToSales: number;
    enterpriseValueToRevenue: number;
    enterpriseValue: number;

    profitMargin: number;
    revenuePerEmployee: number;
    revenuePerShare: number;
    ebitda: number;
    totalRevenue: number;
    grossProfit: number;
    revenue: number;
    currentDebt: number;
    totalCash: number;
    beta: number;
    debtToEquity: number;
    putCallRatio: number;
    companyName: string;
    marketcap: number;
    week52low: number;
    week52high: number;
    week52lowDate: Date;
    week52highDate: Date;
    week52change: number;
    sharesOutstanding: number;
    float: number;
    avg10Volume: number;
    avg30Volume: number;
    day200MovingAvg: number;
    day50MovingAvg: number;
    employees: number;
    ttmEPS: number;
    nextEarningsDate: number;
    peRatio: number;
    // div
    ttmDividendRate: number;
    dividendYield: number;
    nextDividendDate: Date;
    exDividendDate: Date;
    // change percentages
    maxChangePercent: number;
    year5ChangePercent: number;
    year2ChangePercent: number;
    year1ChangePercent: number;
    ytdChangePercent: number;
    month6ChangePercent: number;
    month3ChangePercent: number;
    month1ChangePercent: number;
    day30ChangePercent: number;
    day5ChangePercent: number;
}
