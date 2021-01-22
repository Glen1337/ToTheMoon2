export interface CompanyResearch {
    logo: Logo;
    advStats: AdvancedStats;
}

export interface AdvancedStats {
    week52highDate: Date;
    peLow: number;
    peHigh: number;
    pegRatio: number;
    forwardPERatio: number;
    priceToBook: number;
    priceToSales: number;
    enterpriseValueToRevenue: number;
    enterpriseValue: number;
    week52lowDate: Date;
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
}

export interface Logo{
    url: string;
}