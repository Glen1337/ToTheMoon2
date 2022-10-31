export const MAX_STOCK_LENGTH: number = 8;
export const MIN_STOCK_LENGTH: number = 8;
export const RETRY_COUNT: number = 1;

export class OrderConstants {
    static readonly Buy = 'Buy';
    static readonly Sell = 'Sell';
    static readonly SellToOpen = 'SellToOpen';
    static readonly BuyToOpen = 'BuyToOpen';
    static readonly SellToClose = 'SellToClose';
    static readonly BuyToClose = 'BuyToClose';
    static readonly SellShort = 'SellShort';
    static readonly BuyToCover = 'BuyToCover';
}

export class SecurityConstants {
    static readonly Share = 'Share';
    static readonly Bond = 'Bond';
    static readonly Unit = 'Unit';
    static readonly Call = 'Call';
    static readonly Put = 'Put';
}

export class OutlookConstants {
    static readonly Positive = "Positive";
    static readonly Negative = "Negative";
}

export class PortfolioTypes {
    static readonly Speculation = "Speculation";
    static readonly Retirement = "Retirement";
    static readonly Investment = "Investment";
    static readonly SwingTrading = "Swing Trading";
    static readonly DayTrading = "Day Trading";
    static readonly Other = "Other";
}
