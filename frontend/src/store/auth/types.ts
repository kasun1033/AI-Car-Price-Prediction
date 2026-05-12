export interface User {
    id: string;
    user_id: string | null;
    full_name: string;
    email: string;
    role: string;
    auth_provider: string;
    profile_picture: string | null;
    is_active: boolean;
    is_verified: boolean;
    created_at: string;
}

export interface SignUpRequest {
    full_name: string;
    email: string;
    password: string;
    role: string;
}

export interface SignUpResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export interface SignInRequest {
    email: string;
    password: string;
    role: string;
}

export interface SignInResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isHydrated: boolean;

    isSignUpLoading: boolean;
    signUpError: string | null | undefined;
    isSignUpSuccess: boolean;

    isSignInLoading: boolean;
    signInError: string | null | undefined;
    isSignInSuccess: boolean;

    isGoogleSignInLoading: boolean;
    googleSignInError: string | null | undefined;
    isGoogleSignInSuccess: boolean;

    isDeleteAccountLoading: boolean;
    deleteAccountError: string | null | undefined;
    isDeleteAccountSuccess: boolean;
}
