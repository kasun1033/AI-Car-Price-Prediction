import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import predictionReducer from "./prediction/predictionSlice";
import adminReducer from "./admin/adminSlice";
import feedbackReducer from "./feedback/feedbackSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        prediction: predictionReducer,
        admin: adminReducer,
        feedback: feedbackReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
