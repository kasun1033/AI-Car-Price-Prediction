"use client";

import { useEffect } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

export interface DeleteConfirmDialogProps {
    itemLabel: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting?: boolean;
}

export default function DeleteConfirmDialog({
    itemLabel,
    onConfirm,
    onCancel,
    isDeleting = false,
}: DeleteConfirmDialogProps) {

    // Close on Escape key
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !isDeleting) onCancel();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onCancel, isDeleting]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-desc"
        >
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={!isDeleting ? onCancel : undefined}
            />
            <div className="relative w-full sm:max-w-sm bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
                {!isDeleting && (
                    <button
                        onClick={onCancel}
                        className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        aria-label="Cancel"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                )}

                <div className="px-6 pt-8 pb-6 text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                            <Trash2 className="w-7 h-7 text-red-600" />
                        </div>
                    </div>

                    <div id="delete-dialog-title" className="space-y-1">
                        <h2 className="text-base font-bold text-gray-900">
                            Delete Prediction?
                        </h2>
                        <p
                            id="delete-dialog-desc"
                            className="text-sm text-gray-500"
                        >
                            <span className="font-medium text-gray-700">
                                {itemLabel}
                            </span>{" "}
                            will be permanently removed. This action cannot be
                            undone.
                        </p>
                    </div>

                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-left">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700">
                            All data associated with this prediction will be
                            lost.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button
                            onClick={onCancel}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-sm font-semibold text-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {isDeleting ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Deleting…
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
