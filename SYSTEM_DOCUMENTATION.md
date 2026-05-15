# Car Price Prediction System - Technical Documentation

## 1. System Overview

This project is a full-stack car price prediction platform with:

- A FastAPI backend for authentication, prediction APIs, admin APIs, and persistence.
- A Next.js frontend (App Router + Redux Toolkit) for user and admin experiences.
- A machine learning inference service (scikit-learn model loaded from disk).
- PostgreSQL for core data storage and Redis for request rate limiting.

Core capabilities:

- User registration/login (email-password and Google OAuth)
- Authenticated car price prediction
- Prediction history and deletion
- Feedback submission linked to predictions
- Admin dashboard for stats, users, and feedback management

## 2. High-Level Architecture

Request flow:

1. Frontend sends request to backend API.
2. FastAPI router validates payload and applies rate limits.
3. Auth dependencies validate JWT and role where required.
4. Service layer executes business logic.
5. SQLAlchemy persists/reads data from PostgreSQL.
6. Prediction requests call the loaded ML model service.
7. Backend returns structured JSON responses.

Main backend entrypoint:

- backend/src/app/main.py

Main frontend entrypoint:

- frontend/src/app/layout.tsx

## 3. Backend Architecture

### 3.1 Backend Modules

- API routers:
    - backend/src/app/api/auth_routes.py
    - backend/src/app/api/google_auth_routes.py
    - backend/src/app/api/prediction_routes.py
    - backend/src/app/api/feedback_routes.py
    - backend/src/app/api/admin_routes.py
- Services:
    - backend/src/app/services/model_service.py
    - backend/src/app/services/prediction_service.py
    - backend/src/app/services/feedback_service.py
    - backend/src/app/services/admin_service.py
- DB layer:
    - backend/src/app/db/config.py
    - backend/src/app/db/models.py
    - backend/src/app/db/redis.py
- Auth and guards:
    - backend/src/app/utils/auth_utils.py
    - backend/src/app/utils/dependencies.py
    - backend/src/app/utils/google_oauth.py
    - backend/src/app/utils/rate_limiter.py
    - backend/src/app/utils/ip.py

### 3.2 Startup Behavior

On app startup (backend/src/app/main.py):

- Verifies/creates DB tables via Base.metadata.create_all.
- Loads ML model and model columns via model_service.load().
- If model fails to load, prediction endpoints remain unavailable (503 paths in router).

### 3.3 Authentication and Authorization

- JWT auth:
    - Token is generated in auth routes via create_access_token.
    - get_current_user validates token and loads user from DB.
- Role auth:
    - get_current_admin enforces role == "admin".
- Supported providers:
    - email (password hash via bcrypt)
    - google (ID token verified by google-auth)

### 3.4 Rate Limiting

Redis-based windowed limiter:

- backend/src/app/utils/rate_limiter.py
- Uses key: rate_limit:<identifier>, 60-second TTL window.
- Limits vary by endpoint group (for example auth endpoints are stricter than read-heavy endpoints).

### 3.5 Error Handling

backend/src/app/main.py defines global handlers for:

- validation errors (422)
- HTTP exceptions
- SQLAlchemy errors
- generic exceptions

When DEBUG_MODE=true, extra debug_info is included in 500 responses.

## 4. Database Model

Defined in backend/src/app/db/models.py.

### 4.1 User

- UUID primary key
- full_name, email (unique), hashed_password (nullable for OAuth users)
- role (user/admin)
- auth_provider, oauth_id, profile_picture
- is_active, is_verified
- created_at, updated_at
- Relations:
    - one-to-many prediction_logs
    - one-to-many feedbacks

### 4.2 PredictionLog

- UUID primary key
- user_id FK -> users
- input_payload (JSON)
- predicted_price_lkr (float)
- warnings (JSON)
- created_at
- Relations:
    - many-to-one user
    - one-to-many feedbacks

### 4.3 Feedback

- UUID primary key
- user_id FK -> users
- prediction_id FK -> prediction_logs (nullable)
- message, rating
- created_at
- Relations:
    - many-to-one user
    - many-to-one prediction_log

## 5. API Surface

All routers are mounted with /api prefix.

### 5.1 Auth APIs

- POST /api/auth/register
- POST /api/auth/login
- DELETE /api/auth/delete-account
- POST /api/auth/google

### 5.2 Prediction APIs

- GET /api/predictions/metadata
- POST /api/predictions/predict
- GET /api/predictions/history
- GET /api/predictions/count
- DELETE /api/predictions/history/{prediction_id}

### 5.3 Feedback APIs

- POST /api/feedbacks/create

### 5.4 Admin APIs

- GET /api/admin/stats
- GET /api/admin/users
- DELETE /api/admin/users/{user_id}
- GET /api/admin/feedbacks
- DELETE /api/admin/feedbacks/{feedback_id}

### 5.5 Health API

- GET /health

## 6. ML Prediction Flow

Implementation: backend/src/app/services/model_service.py

Flow:

1. Load model artifact and feature columns from backend/src/app/models.
2. Validate and normalize incoming payload.
3. Build one-row DataFrame, one-hot encode categorical features.
4. Reindex to training columns and run model.predict().
5. Clamp negative predictions to 0 and return warnings when applicable.

Notes:

- Unknown brand may map to OTHER if Brand_OTHER exists in features.
- Unknown model raises a validation error.
- Metadata endpoint derives available brands/models/gears/fuel_types/conditions from model columns.

## 7. Frontend Architecture

### 7.1 Route Structure (Next.js App Router)

- Root layout: frontend/src/app/layout.tsx
- Site group:
    - frontend/src/app/(site)/page.tsx
    - frontend/src/app/(site)/dashboard/page.tsx
    - frontend/src/app/(site)/predict/page.tsx
- Auth group:
    - frontend/src/app/(auth)/login/page.tsx
    - frontend/src/app/(auth)/signup/page.tsx
- Admin group:
    - frontend/src/app/(admin)/admin/dashboard/page.tsx
    - frontend/src/app/admin/login/page.tsx

### 7.2 State Management

Redux store:

- frontend/src/store/index.ts

Slices:

- auth slice: login/signup/google signin/delete account and hydration
- prediction slice: metadata, predict, history, count, delete prediction
- feedback slice: create feedback
- admin slice: stats, users, feedbacks, delete user/feedback

### 7.3 API Client and Session Behavior

API utility: frontend/src/utils/api.ts

- Axios base URL: ${NEXT_PUBLIC_API_BASE_URL}/api
- Request interceptor injects Bearer token from localStorage.
- Response interceptor handles 401 by clearing local token and redirecting to /login.

Route protection:

- frontend/src/components/auth/ProtectedRoute.tsx
- Waits for Redux hydration, then redirects unauthenticated users.

## 8. Important User Flows

### 8.1 User Signup/Login

- User submits signup or login form.
- Frontend dispatches auth thunk.
- Backend validates and returns JWT + user object.
- Frontend stores token and user in localStorage and Redux.

### 8.2 Google Login

- Frontend gets Google id_token.
- Backend verifies token and either links existing user or creates new one.
- JWT is returned and session is established.

### 8.3 Prediction Lifecycle

- User opens predict page -> metadata is fetched.
- User submits car attributes -> backend predicts and stores prediction log.
- Frontend shows result and warnings.
- Optional feedback can be submitted for that prediction.

### 8.4 Admin Lifecycle

- Admin logs in.
- Dashboard fetches aggregated stats.
- Admin can list/delete users and list/delete feedback records.

## 9. Configuration and Environment Variables

### 9.1 Backend (.env expected)

- DATABASE_URL (required)
- REDIS_URL (required)
- SECRET_KEY (required for JWT)
- ALGORITHM (default HS256)
- ACCESS_TOKEN_EXPIRE_MINUTES (default 1440)
- GOOGLE_CLIENT_ID (required for Google auth)
- GOOGLE_CLIENT_SECRET
- DEBUG_MODE (optional)

### 9.2 Frontend (.env.local expected)

- NEXT_PUBLIC_API_BASE_URL
- NEXT_PUBLIC_GOOGLE_CLIENT_ID

## 10. Operational Notes

- CORS allowlist is hardcoded in backend/src/app/main.py to local dev origins.
- DB config currently enables SQLAlchemy echo=True (verbose SQL logging).
- Prediction history query is ordered ascending by created_at in service logic.
- Manual DB reset utility exists: backend/src/app/db/init_db.py (drops and recreates tables).
- Admin creation utility exists: backend/scripts/create_admin.py.

## 11. Run Notes

Backend (from repository root):

1. cd backend
2. activate virtual environment
3. run uvicorn src.app.main:server --reload

Frontend:

1. cd frontend
2. npm install
3. npm run dev

Default local URL:

- Frontend: http://localhost:3000
- Backend health: http://127.0.0.1:8000/health

---

This document reflects the current implementation in the repository as of March 16, 2026.
