export interface ResearchData {
    data: IAgg[];
}

interface IAgg {
    time: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: bigint;
    itemsInWindow: number;
}
