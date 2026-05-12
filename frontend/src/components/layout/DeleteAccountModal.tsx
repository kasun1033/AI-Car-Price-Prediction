"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
    deleteAccount,
    clearDeleteAccountError,
    clearDeleteAccountSuccess,
} from "@/store/auth/authSlice";
import { useRouter } from "next/navigation";

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DeleteAccountModal({
    isOpen,
    onClose,
}: DeleteAccountModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [confirmText, setConfirmText] = useState("");
    const {
        user,
        isDeleteAccountLoading,
        deleteAccountError,
        isDeleteAccountSuccess,
    } = useSelector((state: RootState) => state.auth);

    const isConfirmed = confirmText === "DELETE";

    useEffect(() => {
        if (isDeleteAccountSuccess) {
            dispatch(clearDeleteAccountSuccess());
            router.replace("/login");
            onClose();
        }
    }, [isDeleteAccountSuccess, router, onClose, dispatch]);

    useEffect(() => {
        if (isOpen) {
            setConfirmText("");
            dispatch(clearDeleteAccountError());
        }
    }, [isOpen, dispatch]);

    const handleDelete = async () => {
        if (isConfirmed) {
            dispatch(deleteAccount());
        }
    };

    const handleClose = () => {
        if (!isDeleteAccountLoading) {
            setConfirmText("");
            dispatch(clearDeleteAccountError());
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
                onClick={handleClose}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-start justify-between p-6 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Delete Account
                                </h2>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    This action cannot be undone
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={isDeleteAccountLoading}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="px-6 pb-6 space-y-4">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <p className="text-sm text-red-700">
                                Permanently deleting{" "}
                                <span className="font-semibold">
                                    {user?.email}
                                </span>{" "}
                                will remove all your data, predictions, and
                                history. You will be logged out immediately.
                            </p>
                        </div>

                        {deleteAccountError && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <p className="text-sm text-red-700">
                                    {deleteAccountError}
                                </p>
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="confirm-delete"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Type{" "}
                                <span className="font-bold text-gray-900">
                                    DELETE
                                </span>{" "}
                                to confirm
                            </label>
                            <input
                                id="confirm-delete"
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder="DELETE"
                                disabled={isDeleteAccountLoading}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 placeholder:text-gray-400"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleClose}
                                disabled={isDeleteAccountLoading}
                                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={
                                    !isConfirmed || isDeleteAccountLoading
                                }
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                            >
                                {isDeleteAccountLoading
                                    ? "Deleting..."
                                    : "Delete my account"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
