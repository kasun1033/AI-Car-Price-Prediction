import { safeDecodeJwt } from "@/utils/decodeJWT";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "@/utils/api";
import {
    AuthState,
    SignUpRequest,
    SignUpResponse,
    SignInRequest,
    SignInResponse,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const initialState: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isHydrated: false,

    isSignUpLoading: false,
    signUpError: null,
    isSignUpSuccess: false,

    isSignInLoading: false,
    signInError: null,
    isSignInSuccess: false,

    isGoogleSignInLoading: false,
    googleSignInError: null,
    isGoogleSignInSuccess: false,

    isDeleteAccountLoading: false,
    deleteAccountError: null,
    isDeleteAccountSuccess: false,
};

// Sign Up
export const signUp = createAsyncThunk<
    SignUpResponse,
    SignUpRequest,
    { rejectValue: string }
>("auth/signUp", async (signUpPayload, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/auth/register`,
            signUpPayload,
        );
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        return rejectWithValue(
            err.response?.data?.message || "An error occurred during signup.",
        );
    }
});

// Sign In
export const signIn = createAsyncThunk<
    SignInResponse,
    SignInRequest,
    { rejectValue: string }
>("auth/signIn", async (signInPayload, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/auth/login`,
            signInPayload,
        );
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        return rejectWithValue(
            err.response?.data?.message || "An error occurred during signin.",
        );
    }
});

// sign in with google
export const googleSignIn = createAsyncThunk<
    SignInResponse,
    { id_token: string },
    { rejectValue: string }
>("auth/googleSignIn", async ({ id_token }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/google`, {
            id_token,
        });
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        return rejectWithValue(
            err.response?.data?.message || "Google sign-in failed.",
        );
    }
});

// Delete Account
export const deleteAccount = createAsyncThunk<
    { success: boolean; message: string },
    void,
    { rejectValue: string }
>("auth/deleteAccount", async (_, { rejectWithValue }) => {
    try {
        const response = await api.delete("/auth/delete-account");
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        return rejectWithValue(
            err.response?.data?.message || "Failed to delete account.",
        );
    }
});

// auth slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        rehydrateAuth: (state) => {
            if (typeof window !== "undefined") {
                const accessToken = localStorage.getItem("accessToken");
                const userId = localStorage.getItem("userId");
                const user = localStorage.getItem("user");
                if (accessToken && userId) {
                    const payload = safeDecodeJwt(accessToken);
                    // Check if token is valid and not expired
                    if (
                        payload &&
                        (!payload.exp || payload.exp * 1000 > Date.now())
                    ) {
                        state.accessToken = accessToken;
                        state.isAuthenticated = true;
                        state.user = JSON.parse(user || "null");
                    } else {
                        // Token is invalid or expired, remove it
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("userId");
                        localStorage.removeItem("user");
                    }
                }
            }
        },
        // Mark hydration as complete
        setHydrated: (state) => {
            state.isHydrated = true;
        },
        clearSignUpError: (state) => {
            state.signUpError = null;
        },
        clearSignInError: (state) => {
            state.signInError = null;
        },

        clearGoogleSignInError: (state) => {
            state.googleSignInError = null;
        },

        clearSignUpSuccess: (state) => {
            state.isSignUpSuccess = false;
            state.isAuthenticated = false;
        },

        clearSignInSuccess: (state) => {
            state.isSignInSuccess = false;
            state.isAuthenticated = false;
        },

        clearGoogleSignInSuccess: (state) => {
            state.isGoogleSignInSuccess = false;
            state.isAuthenticated = false;
        },

        clearDeleteAccountError: (state) => {
            state.deleteAccountError = null;
        },

        clearDeleteAccountSuccess: (state) => {
            state.isDeleteAccountSuccess = false;
        },

        logout: (state) => {
            if (typeof window !== "undefined") {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("userId");
                localStorage.removeItem("user");
            }
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.isSignUpSuccess = false;
            state.isSignInSuccess = false;
            state.isGoogleSignInSuccess = false;
        },
    },
    extraReducers: (builder) => {
        // Sign Up
        builder.addCase(signUp.pending, (state) => {
            state.isSignUpLoading = true;
            state.signUpError = null;
            state.isSignUpSuccess = false;
        });
        builder.addCase(signUp.fulfilled, (state, action) => {
            state.isSignUpLoading = false;
            const token = action.payload.access_token;
            if (!token) {
                state.signUpError = "Login succeeded but token missing.";
                state.isSignUpSuccess = false;
                return;
            }
            state.isSignUpSuccess = true;
            state.isAuthenticated = true;
            state.accessToken = token;
            state.user = action.payload.user;
            if (typeof window !== "undefined") {
                localStorage.setItem("accessToken", token);
                localStorage.setItem("userId", action.payload.user.id);
                localStorage.setItem(
                    "user",
                    JSON.stringify(action.payload.user),
                );
            }
        });
        builder.addCase(signUp.rejected, (state, action) => {
            state.isSignUpLoading = false;
            state.signUpError =
                action.payload || "An error occurred during signup.";
        });

        // Sign In
        builder.addCase(signIn.pending, (state) => {
            state.isSignInLoading = true;
            state.signInError = null;
            state.isSignInSuccess = false;
        });
        builder.addCase(signIn.fulfilled, (state, action) => {
            state.isSignInLoading = false;
            const token = action.payload.access_token;
            if (!token) {
                state.signInError = "Login succeeded but token missing.";
                state.isSignInSuccess = false;
                return;
            }
            state.isSignInSuccess = true;
            state.isAuthenticated = true;
            state.accessToken = token;
            state.user = action.payload.user;
            if (typeof window !== "undefined") {
                localStorage.setItem("accessToken", token);
                localStorage.setItem("userId", action.payload.user.id);
                localStorage.setItem(
                    "user",
                    JSON.stringify(action.payload.user),
                );
            }
        });
        builder.addCase(signIn.rejected, (state, action) => {
            state.isSignInLoading = false;
            state.signInError =
                action.payload || "An error occurred during signin.";
        });

        // Google Sign In
        builder.addCase(googleSignIn.pending, (state) => {
            state.isGoogleSignInLoading = true;
            state.googleSignInError = null;
            state.isGoogleSignInSuccess = false;
        });
        builder.addCase(googleSignIn.fulfilled, (state, action) => {
            state.isGoogleSignInLoading = false;
            const token = action.payload.access_token;
            if (!token) {
                state.googleSignInError = "Login succeeded but token missing.";
                state.isGoogleSignInSuccess = false;
                return;
            }
            state.isGoogleSignInSuccess = true;
            state.isAuthenticated = true;
            state.accessToken = token;
            state.user = action.payload.user;
            if (typeof window !== "undefined") {
                localStorage.setItem("accessToken", token);
                localStorage.setItem("userId", action.payload.user.id);
                localStorage.setItem(
                    "user",
                    JSON.stringify(action.payload.user),
                );
            }
        });
        builder.addCase(googleSignIn.rejected, (state, action) => {
            state.isGoogleSignInLoading = false;
            state.googleSignInError =
                action.payload || "An error occurred during google signin.";
        });

        // Delete Account
        builder.addCase(deleteAccount.pending, (state) => {
            state.isDeleteAccountLoading = true;
            state.deleteAccountError = null;
            state.isDeleteAccountSuccess = false;
        });
        builder.addCase(deleteAccount.fulfilled, (state) => {
            state.isDeleteAccountLoading = false;
            state.isDeleteAccountSuccess = true;
            // Clear user data
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            // Clear all sign-in success flags to prevent redirect loops
            state.isSignInSuccess = false;
            state.isGoogleSignInSuccess = false;
            state.isSignUpSuccess = false;
            if (typeof window !== "undefined") {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("userId");
                localStorage.removeItem("user");
            }
        });
        builder.addCase(deleteAccount.rejected, (state, action) => {
            state.isDeleteAccountLoading = false;
            state.deleteAccountError =
                action.payload || "Failed to delete account.";
        });
    },
});

export const {
    clearSignUpError,
    clearSignInError,
    clearSignUpSuccess,
    clearSignInSuccess,
    clearGoogleSignInError,
    clearGoogleSignInSuccess,
    clearDeleteAccountError,
    clearDeleteAccountSuccess,
    logout,
    rehydrateAuth,
    setHydrated,
} = authSlice.actions;
export default authSlice.reducer;
