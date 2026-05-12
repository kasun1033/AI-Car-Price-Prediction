"use client";

import { AlertTriangle, X } from "lucide-react";

interface DeleteUserModalProps {
    isOpen: boolean;
    isDeleting: boolean;
    userName: string;
    userEmail: string;
    onConfirm: () => void;
    onClose: () => void;
}

export default function DeleteUserModal({
    isOpen,
    isDeleting,
    userName,
    userEmail,
    onConfirm,
    onClose,
}: DeleteUserModalProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between p-6 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Delete User
                                </h2>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    This action cannot be undone
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="px-6 pb-6 space-y-4">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <p className="text-sm text-red-700">
                                You are about to permanently delete the account of{" "}
                                <span className="font-semibold">{userName}</span>{" "}
                                ({userEmail}). All their data, predictions, and history
                                will be removed.
                            </p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={onClose}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                            >
                                {isDeleting ? "Deleting..." : "Delete User"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
