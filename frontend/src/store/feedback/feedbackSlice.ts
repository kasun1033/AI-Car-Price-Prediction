import api from "@/utils/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FeedbackRequest, FeedbackResponse } from "./types";

interface FeedbackState {
    feedbacks: FeedbackResponse[];
    loading: boolean;
    error: string | null;
    success: boolean | null;
}

const initialState: FeedbackState = {
    feedbacks: [],
    loading: false,
    error: null,
    success: null,
};

export const submitFeedback = createAsyncThunk<
    FeedbackResponse,
    FeedbackRequest,
    { rejectValue: string }
>("feedback/create", async (feedbackPayload, { rejectWithValue }) => {
    try {
        const response = await api.post(
            '/feedbacks/create',
            feedbackPayload,
        );
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        return rejectWithValue(
            err.response?.data?.message || "An error occurred during feedback submission.",
        );
    }
});

const feedbackSlice = createSlice({
    name: "feedback",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitFeedback.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitFeedback.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.feedbacks.push(action.payload);
            })
            .addCase(submitFeedback.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "An error occurred during signup.";
            });
    },
});

export const { clearError, clearSuccess } = feedbackSlice.actions;
export default feedbackSlice.reducer;
