import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/utils/api";
import {
    PredictionState,
    PredictionIn,
    PredictionResponse,
    MetadataOut,
    MetadataResponse,
    PredictionHistoryResponse,
    PredictionHistoryOut,
    PredictionCountResponse,
} from "./types";

const initialState: PredictionState = {
    // metadata
    metadata: null,
    isMetadataLoading: false,
    metadataError: null,

    // predict
    predictionResult: null,
    isPredictLoading: false,
    predictError: null,
    isPredictSuccess: false,

    // history
    predictionHistory: [],
    historyPagination: null,
    isHistoryLoading: false,
    historyError: null,

    // count
    predictionCount: null,
    isCountLoading: false,
    countError: null,

    // delete
    isDeleting: false,
    deleteError: null,
};

function extractErrorMessage(error: unknown, fallback: string): string {
    const err = error as {
        response?: { data?: { detail?: string; message?: string } };
    };
    return (
        err.response?.data?.detail || err.response?.data?.message || fallback
    );
}

// fetch metadata
export const fetchMetadata = createAsyncThunk<
    MetadataOut,
    void,
    { rejectValue: string }
>("prediction/fetchMetadata", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get<MetadataResponse>(
            "/predictions/metadata",
        );
        return response.data.data;
    } catch (error: unknown) {
        return rejectWithValue(
            extractErrorMessage(error, "Failed to fetch metadata."),
        );
    }
});

// predict car price
export const predict = createAsyncThunk<
    PredictionResponse,
    PredictionIn,
    { rejectValue: string }
>("prediction/predict", async (payload, { rejectWithValue }) => {
    try {
        const response = await api.post<PredictionResponse>(
            "/predictions/predict",
            payload,
        );
        return response.data;
    } catch (error: unknown) {
        return rejectWithValue(
            extractErrorMessage(error, "Failed to predict car price."),
        );
    }
});

// fetch prediction history for the user
export const fetchPredictionHistory = createAsyncThunk<
    PredictionHistoryResponse,
    { limit?: number; page?: number },
    { rejectValue: string }
>(
    "prediction/fetchPredictionHistory",
    async ({ limit = 20, page = 1 }, { rejectWithValue }) => {
        try {
            const response = await api.get<PredictionHistoryResponse>(
                "/predictions/history",
                { params: { limit, page } },
            );
            return response.data;
        } catch (error: unknown) {
            return rejectWithValue(
                extractErrorMessage(
                    error,
                    "Failed to fetch prediction history.",
                ),
            );
        }
    },
);

// get the total number of predictions
export const fetchPredictionCount = createAsyncThunk<
    PredictionCountResponse,
    void,
    { rejectValue: string }
>("prediction/fetchPredictionCount", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get<PredictionCountResponse>(
            "/predictions/count",
        );
        return response.data;
    } catch (error: unknown) {
        return rejectWithValue(
            extractErrorMessage(error, "Failed to fetch prediction count."),
        );
    }
});

// delete a single prediction
export const deletePrediction = createAsyncThunk<
    string, // returns the deleted id so we can remove it from state
    string, // arg: prediction id
    { rejectValue: string }
>("prediction/deletePrediction", async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/predictions/history/${id}`);
        return id;
    } catch (error: unknown) {
        return rejectWithValue(
            extractErrorMessage(error, "Failed to delete prediction."),
        );
    }
});

// Prediction slice
const predictionSlice = createSlice({
    name: "prediction",
    initialState,
    reducers: {
        clearPredictError: (state) => {
            state.predictError = null;
        },
        clearPredictSuccess: (state) => {
            state.isPredictSuccess = false;
            state.predictionResult = null;
        },
        clearMetadataError: (state) => {
            state.metadataError = null;
        },
        clearHistoryError: (state) => {
            state.historyError = null;
        },
        clearDeleteError: (state) => {
            state.deleteError = null;
        },
        clearPredictResult: (state) => {
            state.predictionResult = null;
        },
    },
    extraReducers: (builder) => {
        // fetchMetadata
        builder.addCase(fetchMetadata.pending, (state) => {
            state.isMetadataLoading = true;
            state.metadataError = null;
        });
        builder.addCase(fetchMetadata.fulfilled, (state, action) => {
            state.isMetadataLoading = false;
            state.metadata = action.payload;
        });
        builder.addCase(fetchMetadata.rejected, (state, action) => {
            state.isMetadataLoading = false;
            state.metadataError = action.payload || "Failed to fetch metadata.";
        });

        // predict
        builder.addCase(predict.pending, (state) => {
            state.isPredictLoading = true;
            state.predictError = null;
            state.isPredictSuccess = false;
        });
        builder.addCase(predict.fulfilled, (state, action) => {
            state.isPredictLoading = false;
            state.isPredictSuccess = true;
            state.predictionResult = action.payload;
        });
        builder.addCase(predict.rejected, (state, action) => {
            state.isPredictLoading = false;
            state.predictError =
                action.payload || "Failed to predict car price.";
        });

        // fetchPredictionHistory
        builder.addCase(fetchPredictionHistory.pending, (state) => {
            state.isHistoryLoading = true;
            state.historyError = null;
        });
        builder.addCase(fetchPredictionHistory.fulfilled, (state, action) => {
            state.isHistoryLoading = false;
            state.predictionHistory = action.payload.data;
            state.historyPagination = action.payload.pagination;
        });
        builder.addCase(fetchPredictionHistory.rejected, (state, action) => {
            state.isHistoryLoading = false;
            state.historyError =
                action.payload || "Failed to fetch prediction history.";
        });

        // fetchPredictionCount
        builder.addCase(fetchPredictionCount.pending, (state) => {
            state.isCountLoading = true;
            state.countError = null;
        });
        builder.addCase(fetchPredictionCount.fulfilled, (state, action) => {
            state.isCountLoading = false;
            state.predictionCount = action.payload;
        });
        builder.addCase(fetchPredictionCount.rejected, (state, action) => {
            state.isCountLoading = false;
            state.countError =
                action.payload || "Failed to fetch prediction count.";
        });

        // deletePrediction
        builder.addCase(deletePrediction.pending, (state) => {
            state.isDeleting = true;
            state.deleteError = null;
        });
        builder.addCase(deletePrediction.fulfilled, (state, action) => {
            state.isDeleting = false;
            state.predictionHistory = state.predictionHistory.filter(
                (p) => p.id !== action.payload,
            );

            if (state.historyPagination) {
                const nextTotal = Math.max(0, state.historyPagination.total - 1);
                state.historyPagination.total = nextTotal;
                state.historyPagination.total_pages = Math.ceil(
                    nextTotal / state.historyPagination.limit,
                );
                state.historyPagination.has_next =
                    state.historyPagination.page <
                    state.historyPagination.total_pages;
                state.historyPagination.has_previous =
                    state.historyPagination.page > 1;
            }
        });
        builder.addCase(deletePrediction.rejected, (state, action) => {
            state.isDeleting = false;
            state.deleteError =
                action.payload || "Failed to delete prediction.";
        });
    },
});

export const {
    clearPredictError,
    clearPredictSuccess,
    clearMetadataError,
    clearHistoryError,
    clearDeleteError,
    clearPredictResult,
} = predictionSlice.actions;

export default predictionSlice.reducer;
