"use client";
// import { useRef } from 'react';
import { Provider } from "react-redux";
import { store } from "@/store";
// import { makeStore, AppStore } from '@/store/store';

export default function ReduxProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return <Provider store={store}>{children}</Provider>;
}
