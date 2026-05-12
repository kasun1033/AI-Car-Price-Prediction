export interface User {
    id: string;
    full_name: string;
    email: string;
    role: string;
    auth_provider: string;
    is_active: boolean;
    is_verified: boolean;
    created_at: string;
    prediction_count: number;
    feedback_count: number;
}

export interface Feedback {
    id: string;
    user_id: string;
    prediction_id?: string | null;
    message: string;
    rating: number | null;
    created_at: string;
    user_name: string | null;
    user_email: string | null;
    // Prediction details
    prediction_input?: Record<string, any> | null;
    prediction_output?: number | null;
    prediction_warnings?: string[] | null;
}

export interface DashboardStats {
    total_users: number;
    total_predictions: number;
    total_feedbacks: number;
    active_users: number;
    recent_signups: number;
    avg_rating: number | null;
}

export interface AdminState {
    stats: DashboardStats | null;
    users: User[];
    feedbacks: Feedback[];

    isStatsLoading: boolean;
    statsError: string | null;

    isUsersLoading: boolean;
    usersError: string | null;

    isFeedbacksLoading: boolean;
    feedbacksError: string | null;

    isDeleting: boolean;
    deleteError: string | null;
}
