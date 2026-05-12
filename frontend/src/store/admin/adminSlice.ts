import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { AdminState, DashboardStats, User, Feedback } from "./types";


const initialState: AdminState = {
    stats: null,
    users: [],
    feedbacks: [],

    isStatsLoading: false,
    statsError: null,

    isUsersLoading: false,
    usersError: null,

    isFeedbacksLoading: false,
    feedbacksError: null,

    isDeleting: false,
    deleteError: null,
};

// Fetch dashboard stats
export const fetchAdminStats = createAsyncThunk<
    DashboardStats,
    void,
    { rejectValue: string }
>("admin/fetchStats", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/admin/stats');
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        return rejectWithValue(
            err.response?.data?.message || "Failed to fetch statistics",
        );
    }
});

// Fetch all users
export const fetchAllUsers = createAsyncThunk<
    User[],
    { skip?: number; limit?: number },
    { rejectValue: string }
>(
    "admin/fetchUsers",
    async ({ skip = 0, limit = 100 }, { rejectWithValue }) => {
        try {
            const response = await api.get(
                `/admin/users?skip=${skip}&limit=${limit}`,
            );
            return response.data;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch users",
            );
        }
    },
);

// Delete user
export const deleteUser = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>("admin/deleteUser", async (userId, { rejectWithValue }) => {
    try {
        await api.delete(`/admin/users/${userId}`);
        return userId;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        return rejectWithValue(
            err.response?.data?.message || "Failed to delete user",
        );
    }
});

// Fetch all feedbacks
export const fetchAllFeedbacks = createAsyncThunk<
    Feedback[],
    { skip?: number; limit?: number },
    { rejectValue: string }
>(
    "admin/fetchFeedbacks",
    async ({ skip = 0, limit = 100 }, { rejectWithValue }) => {
        try {
            const response = await api.get(
                `/admin/feedbacks?skip=${skip}&limit=${limit}`,
            );
            return response.data;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch feedbacks",
            );
        }
    },
);

// Delete feedback
export const deleteFeedback = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>("admin/deleteFeedback", async (feedbackId, { rejectWithValue }) => {
    try {
        await api.delete(`/admin/feedbacks/${feedbackId}`);
        return feedbackId;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        return rejectWithValue(
            err.response?.data?.message || "Failed to delete feedback",
        );
    }
});

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.statsError = null;
            state.usersError = null;
            state.feedbacksError = null;
            state.deleteError = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch stats
        builder.addCase(fetchAdminStats.pending, (state) => {
            state.isStatsLoading = true;
            state.statsError = null;
        });
        builder.addCase(fetchAdminStats.fulfilled, (state, action) => {
            state.isStatsLoading = false;
            state.stats = action.payload;
        });
        builder.addCase(fetchAdminStats.rejected, (state, action) => {
            state.isStatsLoading = false;
            state.statsError = action.payload || "Failed to fetch statistics";
        });

        // Fetch users
        builder.addCase(fetchAllUsers.pending, (state) => {
            state.isUsersLoading = true;
            state.usersError = null;
        });
        builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
            state.isUsersLoading = false;
            state.users = action.payload;
        });
        builder.addCase(fetchAllUsers.rejected, (state, action) => {
            state.isUsersLoading = false;
            state.usersError = action.payload || "Failed to fetch users";
        });

        // Delete user
        builder.addCase(deleteUser.pending, (state) => {
            state.isDeleting = true;
            state.deleteError = null;
        });
        builder.addCase(deleteUser.fulfilled, (state, action) => {
            state.isDeleting = false;
            state.users = state.users.filter(
                (user) => user.id !== action.payload,
            );
            // Update stats
            if (state.stats) {
                state.stats.total_users = Math.max(
                    0,
                    state.stats.total_users - 1,
                );
            }
        });
        builder.addCase(deleteUser.rejected, (state, action) => {
            state.isDeleting = false;
            state.deleteError = action.payload || "Failed to delete user";
        });

        // Fetch feedbacks
        builder.addCase(fetchAllFeedbacks.pending, (state) => {
            state.isFeedbacksLoading = true;
            state.feedbacksError = null;
        });
        builder.addCase(fetchAllFeedbacks.fulfilled, (state, action) => {
            state.isFeedbacksLoading = false;
            state.feedbacks = action.payload;
        });
        builder.addCase(fetchAllFeedbacks.rejected, (state, action) => {
            state.isFeedbacksLoading = false;
            state.feedbacksError =
                action.payload || "Failed to fetch feedbacks";
        });

        // Delete feedback
        builder.addCase(deleteFeedback.pending, (state) => {
            state.isDeleting = true;
            state.deleteError = null;
        });
        builder.addCase(deleteFeedback.fulfilled, (state, action) => {
            state.isDeleting = false;
            state.feedbacks = state.feedbacks.filter(
                (feedback) => feedback.id !== action.payload,
            );
            // Update stats
            if (state.stats) {
                state.stats.total_feedbacks = Math.max(
                    0,
                    state.stats.total_feedbacks - 1,
                );
            }
        });
        builder.addCase(deleteFeedback.rejected, (state, action) => {
            state.isDeleting = false;
            state.deleteError = action.payload || "Failed to delete feedback";
        });
    },
});

export const { clearErrors } = adminSlice.actions;
export default adminSlice.reducer;
