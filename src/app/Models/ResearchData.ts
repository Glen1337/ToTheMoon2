export interface ResearchData {
    data: IAgg[];
}

export interface IAgg {
    timeUtc: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: bigint;
    itemsInWindow: number;
}
