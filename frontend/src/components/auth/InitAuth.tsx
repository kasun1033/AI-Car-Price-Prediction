"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { rehydrateAuth, setHydrated } from "@/store/auth/authSlice";

export default function InitAuth() {
    const dispatch = useDispatch()
    // Rehydrate auth state from localStorage on mount BEFORE first render
    useEffect(() => {
        dispatch(rehydrateAuth());
        // Mark hydration as complete after rehydration
        dispatch(setHydrated());
    }, [dispatch]);

    return null;
}
