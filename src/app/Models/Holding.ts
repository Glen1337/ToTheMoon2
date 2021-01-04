export interface Holding {
    holdingId?: number;
    costBasis: number;
    quantity: number;
    symbol: string;
    reinvestDivs: boolean;
    securityType: string;
    isOpen?: boolean;
    currentPrice: number;
    transactionDate?: Date;
    orderType: string
    expirationDate?: Date;
    portfolioId: number;
    strikePrice?: number;
  }
