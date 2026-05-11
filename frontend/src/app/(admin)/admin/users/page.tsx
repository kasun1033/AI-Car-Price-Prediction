"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchAllUsers, deleteUser } from "@/store/admin/adminSlice";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DeleteUserModal from "@/components/admin/DeleteUserModal";
import { Trash2, AlertCircle } from "lucide-react";

export default function UserManagement() {
    const dispatch = useDispatch<AppDispatch>();
    const { users, isUsersLoading, usersError, isDeleting } = useSelector(
        (state: RootState) => state.admin,
    );
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<{ id: string; name: string; email: string } | null>(null);

    const openDeleteModal = (user: { id: string; full_name: string; email: string }) => {
        setUserToDelete({ id: user.id, name: user.full_name, email: user.email });
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        if (!isDeleting) {
            setShowDeleteModal(false);
            setUserToDelete(null);
        }
    };

    useEffect(() => {
        dispatch(fetchAllUsers({ skip: 0, limit: 100 }));
    }, [dispatch]);

    const handleDeleteUser = async (userId: string) => {
        await dispatch(deleteUser(userId));
        closeDeleteModal();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <AdminSidebar />

            <main className="flex-1 overflow-y-auto bg-gray-100 pt-14 md:pt-0">
                <div className="bg-blue-950 border-b border-gray-200 px-8 py-6">
                    <h1 className="text-[28px] font-bold text-white">
                        User Management
                    </h1>
                    <p className="text-gray-200 mt-2">
                        Manage all registered users
                    </p>
                </div>

                <div className="p-8">
                    {isUsersLoading ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                            <div className="animate-pulse space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className="h-16 bg-gray-200 rounded"
                                    ></div>
                                ))}
                            </div>
                        </div>
                    ) : usersError ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                            <p className="text-red-600">{usersError}</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                            <p className="text-gray-500">No users found</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Provider
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Joined
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.full_name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {user.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role ===
                                                            "admin"
                                                            ? "bg-purple-100 text-purple-800"
                                                            : "bg-blue-100 text-blue-800"
                                                            }`}
                                                    >
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        {user.auth_provider}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                            }`}
                                                    >
                                                        {user.is_active
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(
                                                        user.created_at,
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => openDeleteModal(user)}
                                                        className="text-red-600 hover:text-red-900 flex items-center gap-1 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <DeleteUserModal
                isOpen={showDeleteModal}
                isDeleting={isDeleting}
                userName={userToDelete?.name ?? ""}
                userEmail={userToDelete?.email ?? ""}
                onConfirm={() => userToDelete && handleDeleteUser(userToDelete.id)}
                onClose={closeDeleteModal}
            />
        </div>
    );
}
