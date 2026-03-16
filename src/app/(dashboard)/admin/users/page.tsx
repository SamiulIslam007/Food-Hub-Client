"use client";

import { useEffect, useState } from "react";
import { Users, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  providerProfile?: { businessName: string; approvalStatus: string };
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  SUSPENDED: "bg-red-100 text-red-600",
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-700",
  PROVIDER: "bg-blue-100 text-blue-700",
  CUSTOMER: "bg-gray-100 text-gray-600",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getAllUsers({
        role: roleFilter as "CUSTOMER" | "PROVIDER" | "ADMIN" | undefined || undefined,
        status: statusFilter as "ACTIVE" | "SUSPENDED" | undefined || undefined,
        limit: 30,
      });
      setUsers(res.data?.users || res.data || []);
    } catch {
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter, statusFilter]);

  const handleToggleStatus = async (userId: string, userName: string) => {
    try {
      await adminService.toggleUserStatus(userId);
      toast.success(`${userName} status updated`);
      fetchUsers();
    } catch {
      toast.error("Could not update status");
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">
        User Management
      </h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-400 bg-white"
        >
          <option value="">All Roles</option>
          <option value="CUSTOMER">Customer</option>
          <option value="PROVIDER">Provider</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-400 bg-white"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-14 bg-white border border-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-5 py-3">
                    User
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-5 py-3">
                    Role
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-5 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-5 py-3">
                    Joined
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase px-5 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div>
                        <p className="font-semibold text-sm text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${ROLE_COLORS[user.role]}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[user.status]}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleToggleStatus(user.id, user.name)}
                        title={
                          user.status === "ACTIVE" ? "Suspend" : "Activate"
                        }
                        className="text-gray-400 hover:text-orange-500 transition-colors"
                      >
                        {user.status === "ACTIVE" ? (
                          <ToggleRight className="w-6 h-6 text-green-500" />
                        ) : (
                          <ToggleLeft className="w-6 h-6" />
                        )}
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
  );
}
