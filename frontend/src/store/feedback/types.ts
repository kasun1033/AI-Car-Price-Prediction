export interface FeedbackRequest {
    message: string;
    rating: number | null;
    prediction_id: string;
}

export interface FeedbackResponse {
    id: string;
    user_id: string;
    prediction_id: string;
    message: string;
    rating: number | null;
    created_at: string;
    user_name: string;
    user_email: string;
}