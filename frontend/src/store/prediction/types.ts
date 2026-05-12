export interface PredictionIn {
    yom: number;
    engine_cc: number;
    millage_km: number;
    brand: string;
    model: string;
    gear: string;
    fuel_type: string;
    condition: string;
    air_condition: string;
    power_steering: string;
    power_mirror: string;
    power_window: string;
}

export interface PredictionResponse {
    prediction_id: string;
    predicted_price_lkr: number;
    warnings: string[];
}

export interface MetadataOut {
    brands_count: number;
    models_count: number;
    gears: string[];
    fuel_types: string[];
    conditions: string[];
    boolean_fields: string[];
    notes: string[];
}

export interface MetadataResponse {
    data: MetadataOut;
}

export interface FeedbackOut {
    id: string;
    message: string;
    rating: number | null;
    created_at: string;
}

export interface PredictionHistoryOut {
    id: string;
    input_payload: PredictionIn;
    predicted_price_lkr: number;
    warnings: string[] | null;
    created_at: string | null;
    feedbacks: FeedbackOut[];
}

export interface PredictionHistoryPagination {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
}

export interface PredictionHistoryResponse {
    data: PredictionHistoryOut[];
    pagination: PredictionHistoryPagination;
}

export interface PredictionCountResponse {
    count: number;
}

export interface PredictionState {
    // metadata
    metadata: MetadataOut | null;
    isMetadataLoading: boolean;
    metadataError: string | null | undefined;

    // predict
    predictionResult: PredictionResponse | null;
    isPredictLoading: boolean;
    predictError: string | null | undefined;
    isPredictSuccess: boolean;

    // history
    predictionHistory: PredictionHistoryOut[];
    historyPagination: PredictionHistoryPagination | null;
    isHistoryLoading: boolean;
    historyError: string | null | undefined;

    // count
    predictionCount: PredictionCountResponse | null;
    isCountLoading: boolean;
    countError: string | null | undefined;

    // delete
    isDeleting: boolean;
    deleteError: string | null | undefined;
}
