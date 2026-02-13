"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserPlus, FaUserMinus } from "react-icons/fa";
import { FiUsers, FiSearch } from "react-icons/fi";
import { toast } from "sonner";
import { handleSessionExpiry } from "@/utils/handleSessionExpiry";
import { RiDeleteBin6Fill } from "react-icons/ri";
const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

type User = {
  _id: string;
  email: string;
  emailVerified: boolean;
  status: string;
  planName: string;
  storiesCount: number;
  startDate: Date;
  expiryDate: Date;
};

interface UserPlanRowProps {
  planName: string | null;
  expiryDate: string | Date | null;
}

export default function Page() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [disabledStatus, setDisabledStatus] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"new" | "old">("new");

  const debouncedSearch = useCallback(() => {
    let id: number;
    return (value: string) => {
      clearTimeout(id);
      id = window.setTimeout(async () => {
        setPage(1);
        await loadUsers(1, pageSize, value, sortOrder);
      }, 300);
    };
  }, [pageSize])();

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const loadUsers = async (
    pg: number = page,
    pgSize: number = pageSize,
    srch: string = search,
    sOrder: string = sortOrder
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pg),
        pageSize: String(pgSize),
        search: srch,
        sortOrder: sOrder,
      });
      const token = localStorage.getItem("token");
      const res = await fetch(`${serverBaseUrl}/admin/user/?${params}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        if (handleSessionExpiry(data.message, router, true)) return;
        toast.error(data.message || "Failed to fetch users");
        return;
      }

      setUsers(data?.response?.data?.users);
      setTotal(data?.response?.data?.total);
      setPage(data?.response?.data?.page);
      setPageSize(data?.response?.data?.pageSize);
      setTotalPages(data?.response?.data?.totalPages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (status: string, selectedUser: string) => {
    setDisabledStatus(selectedUser);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${serverBaseUrl}/admin/user/${selectedUser}/status?status=${status}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        if (handleSessionExpiry(data.message, router, true)) return;
        toast.error(data.message || "Failed to fetch users");
        return;
      }
      toast.success(`User has been ${status} successfully`);
      await loadUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user status");
    } finally {
      setDisabledStatus("");
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      await loadUsers();
    };
    getUsers();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const handlePageSizeChange = async (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
    await loadUsers(page, newPageSize, search, sortOrder);
  };

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    await loadUsers(newPage, pageSize, search, sortOrder);
  };

  const handleSortChange = async (newSortOrder: "new" | "old") => {
    setSortOrder(newSortOrder);
    setPage(1);
    await loadUsers(1, pageSize, search, newSortOrder);
  };

  const onPrev = async () => {
    if (page > 1) {
      setPage(page - 1);
      await loadUsers(page - 1, pageSize, search, sortOrder);
    }
  };

  const onNext = async () => {
    if (page < totalPages) {
      setPage(page + 1);
      await loadUsers(page + 1, pageSize, search, sortOrder);
    }
  };

  const UserPlanRow: React.FC<UserPlanRowProps> = ({
    planName,
    expiryDate,
  }) => {
    const expiry = expiryDate ? new Date(expiryDate) : null;
    const isExpired = expiry ? expiry < new Date() : false;

    const bgClass = isExpired
      ? "bg-red-100 text-red-800"
      : planName
      ? "bg-[#1D3557] text-white"
      : "bg-gray-100 text-gray-800";

    const label = isExpired ? "Expired" : planName || "No Plan";

    return (
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${bgClass}`}
        >
          {label}
        </span>
      </td>
    );
  };

  const openDelete = (id: string) => {
    setUserId(id);
    setIsDeleteOpen(true);
  };

  const handlDelete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${serverBaseUrl}/admin/user/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        if (handleSessionExpiry(data.message, router, true)) return;
        toast.error(data.message || "Failed to delete user");
        return;
      }

      toast.success(data.message);
      setIsDeleteOpen(false);
      await loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 p-3 md:p-4 lg:p-8 bg-gray-50 min-h-screen overflow-x-auto">
      <div className="max-w-[1440px] mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mb-2">
            User Management
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => handleSortChange("new")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                sortOrder === "new"
                  ? "bg-[#1D3557] text-white hover:bg-[#192e4b]"
                  : "bg-white border text-[#1D3557] hover:bg-gray-50"
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => handleSortChange("old")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                sortOrder === "old"
                  ? "bg-[#1D3557] text-white hover:bg-[#192e4b]"
                  : "bg-white border text-[#1D3557] hover:bg-gray-50"
              }`}
            >
              Oldest
            </button>
          </div>

          <div className="text-black flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search users..."
                className="w-full sm:w-80 px-4 py-2 pl-10 border border-gray-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-[#1D3557]" />
            </div>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-3 py-2 border border-gray-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-[120px]"
            >
              <option value={5}>Show 5</option>
              <option value={10}>Show 10</option>
              <option value={20}>Show 20</option>
              <option value={50}>Show 50</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan Start Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stories Count
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : users?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <FiUsers className="text-gray-400" size={25} />
                        </div>
                        <div className="text-center">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No users found
                          </h3>
                          <p className="text-gray-600">
                            {search.length >= 2
                              ? `No users match your search "${search}"`
                              : "Try adjusting your search or filters"}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users?.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {user.email}
                        </div>
                      </td>
                      <UserPlanRow
                        planName={user.planName}
                        expiryDate={user.expiryDate}
                      />
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                        {formatDate(user.startDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                        {user.storiesCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            user.status === "blocked"
                              ? "bg-red-100 text-red-800"
                              : user.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {user.status !== "blocked" ? (
                            <div className="relative group">
                              <button
                                onClick={() =>
                                  handleChangeStatus("block", user._id)
                                }
                                className="px-2 py-2 rounded-lg transition-colors border border-red-800 text-red-800"
                                disabled={disabledStatus === user._id}
                              >
                                <FaUserMinus size={20} />
                              </button>
                              <div className="absolute bottom-full right-full hidden group-hover:block bg-red-200 text-red-800 text-xs rounded py-1 px-2 z-10">
                                Block
                              </div>
                            </div>
                          ) : (
                            <div className="relative group">
                              <button
                                onClick={() =>
                                  handleChangeStatus("un-block", user._id)
                                }
                                className={`px-2 py-2 rounded-lg transition-colors border ${
                                  user.emailVerified
                                    ? "border-green-800 text-green-800"
                                    : "border-yellow-500 text-yellow-500"
                                }`}
                                disabled={disabledStatus === user._id}
                              >
                                <FaUserPlus size={20} />
                              </button>
                              <div
                                className={`absolute bottom-full right-full hidden group-hover:block ${
                                  user.emailVerified
                                    ? "bg-green-200 text-green-800"
                                    : "bg-yellow-200 text-yellow-800"
                                } text-xs rounded py-1 px-2 z-10`}
                              >
                                Un-Block
                              </div>
                            </div>
                          )}

                          <div className="relative group">
                              <button
                                onClick={() => openDelete(user._id)}
                                className="px-2 py-2 rounded-lg transition-colors border border-red-800 text-red-800"
                              >
                                <RiDeleteBin6Fill size={20} />
                              </button>
                              <div className="absolute bottom-full right-full hidden group-hover:block bg-red-200 text-red-800 text-xs rounded py-1 px-2 z-10">
                                Delete
                              </div>
                            </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-white px-3 md:px-6 py-3 md:py-4 border-t border-gray-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs md:text-sm text-gray-600 text-center sm:text-left">
              Showing{" "}
              <span className="font-medium">
                {total === 0 ? 0 : (page - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(page * pageSize, total)}
              </span>{" "}
              of <span className="font-medium">{total}</span> results
            </div>
            <div className="flex items-center justify-center gap-1 md:gap-2">
              <button
                aria-label="Previous page"
                onClick={() => onPrev()}
                disabled={page === 1 || loading}
                className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </button>
              <div className="flex items-center gap-1 max-w-[200px] overflow-x-auto">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else {
                    if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium rounded-lg transition-colors min-w-[32px] ${
                        pageNum === page
                          ? "bg-[#1D3557] text-white hover:bg-[#192e4b]"
                          : "bg-white border text-[#1D3557] hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                aria-label="Next page"
                onClick={() => onNext()}
                disabled={page === totalPages || loading}
                className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-start justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mt-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handlDelete()}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
