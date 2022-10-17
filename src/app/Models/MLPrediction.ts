export interface MLPrediction {
    strategies: Strategy[];
    combinedStrategyForecastPrice: number;
    combinedShouldYouBuy: boolean;
    lastDay: Date;
    lastClosePrice: number;
}

export interface Strategy
{
    qualityMetricsEvaluation: QualityMetricsEvaluation;
    predictionEvaluation: PredictionEvaluation;
    prediction: Prediction;
    algorithm: string;
}

export interface Prediction{
    lastDayDate: Date;
    lastDayClosingPrice: number;
    predictedNextDayClosingPrice: number;
    shouldYouBuy: boolean;
}

export interface PredictionEvaluation {
    predictionDayDate: Date;
    actualDate: Date;
    predictedNextDayClosingPrice: number;
    actualClosingPrice: number;
    percentError: number;
}

export interface QualityMetricsEvaluation {
    rSquaredScore: number;
    rootMeanSquaredError: number;
    meanAbsoluteLossError: number;
}
