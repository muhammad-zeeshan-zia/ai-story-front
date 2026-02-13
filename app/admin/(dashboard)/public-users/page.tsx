"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  RiDeleteBin6Fill,
  RiEdit2Fill,
  RiUserSearchFill,
} from "react-icons/ri";
import {
  IoClose,
  IoCheckmark,
  IoEyeOffOutline,
  IoEyeOutline,
} from "react-icons/io5";
import { handleSessionExpiry } from "@/utils/handleSessionExpiry";
const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

type User = {
  _id: string;
  email: string;
  passwordExpiryDate: Date;
  storyExpiryDate: Date;
};

export default function UserManagement() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const minDate = yesterday.toISOString().split("T")[0];
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    passwordExpiryDate: "",
    storyExpiryDate: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    passwordExpiryDate: "",
    storyExpiryDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const loadPublicUsers = async (
    pg: number = page,
    pgSize: number = pageSize
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pg),
        pageSize: String(pgSize),
      });
      const token = localStorage.getItem("token");
      const res = await fetch(`${serverBaseUrl}/admin/public-user/?${params}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        if (handleSessionExpiry(data.message, router, true)) return;
        toast.error(data.message || "Failed to fetch public users");
        return;
      }

      setUsers(data?.response?.data?.publicUsers);
      setTotal(data?.response?.data?.total);
      setPage(data?.response?.data?.page);
      setPageSize(data?.response?.data?.pageSize);
      setTotalPages(data?.response?.data?.totalPages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch public users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getPublicUsers = async () => {
      await loadPublicUsers();
    };
    getPublicUsers();
  }, []);

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    await loadPublicUsers(newPage, pageSize);
  };

  const onPrev = async () => {
    if (page > 1) {
      setPage(page - 1);
      await loadPublicUsers(page - 1, pageSize);
    }
  };

  const onNext = async () => {
    if (page < totalPages) {
      setPage(page + 1);
      await loadPublicUsers(page + 1, pageSize);
    }
  };

  const openCreate = () => {
    setForm({
      email: "",
      password: "",
      confirmPassword: "",
      passwordExpiryDate: "",
      storyExpiryDate: "",
    });
    setErrors({
      email: "",
      password: "",
      confirmPassword: "",
      passwordExpiryDate: "",
      storyExpiryDate: "",
    });
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setIsCreateOpen(true);
  };

  const handleCreate = async () => {
    setLoading(true);
    setErrors({
      email: "",
      password: "",
      confirmPassword: "",
      passwordExpiryDate: "",
      storyExpiryDate: "",
    });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${serverBaseUrl}/admin/public-user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        if (handleSessionExpiry(data.message, router, true)) return;
        if (response.status === 403) {
          const error = typeof data.error;
          if (error === "object") {
            setErrors(data.error);
          }
          return;
        } else {
          toast.error(data.message || "Failed to create public user");
          return;
        }
      }

      toast.success(data.message);
      await loadPublicUsers();
      setIsCreateOpen(false);
      setForm({
        email: "",
        password: "",
        confirmPassword: "",
        passwordExpiryDate: "",
        storyExpiryDate: "",
      });
      setShowConfirm(false);
      setShowPassword(false);
    } catch (error) {
      console.error("Error creating public user:", error);
      toast.error("Failed to create public user");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (user: User) => {
    const getISODate = (value: string | Date | null | undefined) => {
      if (!value) return "";
      const iso = value instanceof Date ? value.toISOString() : value;
      return iso.split("T")[0];
    };

    setForm({
      email: "",
      password: "",
      confirmPassword: "",
      passwordExpiryDate: getISODate(user.passwordExpiryDate),
      storyExpiryDate: getISODate(user.storyExpiryDate),
    });
    setErrors({
      email: "",
      password: "",
      confirmPassword: "",
      passwordExpiryDate: "",
      storyExpiryDate: "",
    });
    setUserId(user._id);
    setIsCreateOpen(false);
    setIsDeleteOpen(false);
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    setLoading(true);
    setErrors({
      email: "",
      password: "",
      confirmPassword: "",
      passwordExpiryDate: "",
      storyExpiryDate: "",
    });

    const updatedData = {
      password: form.password,
      confirmPassword: form.confirmPassword,
      passwordExpiryDate: form.passwordExpiryDate,
      storyExpiryDate: form.storyExpiryDate,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${serverBaseUrl}/admin/public-user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        if (handleSessionExpiry(data.message, router, true)) return;
        if (response.status === 403) {
          const error = typeof data.error;
          if (error === "object") {
            setErrors(data.error);
          }
          return;
        } else {
          toast.error(data.message || "Failed to update public user");
          return;
        }
      }

      toast.success(data.message);
      await loadPublicUsers();
      setIsEditOpen(false);
      setForm({
        email: "",
        password: "",
        confirmPassword: "",
        passwordExpiryDate: "",
        storyExpiryDate: "",
      });
      setShowConfirm(false);
      setShowPassword(false);
    } catch (error) {
      console.error("Error updating public user:", error);
      toast.error("Failed to update public user");
    } finally {
      setLoading(false);
    }
  };

  const openDelete = (id: string) => {
    setUserId(id);
    setIsCreateOpen(false);
    setIsEditOpen(false);
    setIsDeleteOpen(true);
  };

  const handlDelete = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${serverBaseUrl}/admin/public-user/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        if (handleSessionExpiry(data.message, router, true)) return;
        toast.error(data.message || "Failed to delete public user");
        return;
      }

      toast.success(data.message);
      setIsDeleteOpen(false);
      await loadPublicUsers();
    } catch (error) {
      console.error("Error deleting public user:", error);
      toast.error("Failed to delete public user");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return "—";
    const isoString =
      typeof dateString === "string" ? dateString : dateString.toISOString();

    const datePart = isoString.split("T")[0];
    const [year, month, day] = datePart.split("-");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
  };

  return (
    <main className="flex-1 p-3 md:p-4 lg:p-8 bg-gray-50 min-h-screen overflow-x-auto">
      <div className="max-w-[1440px] mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mb-2">
            Public Users Management
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-end">
          <button
            onClick={() => openCreate()}
            className="px-4 py-2 rounded-lg font-medium transition-colors bg-[#1D3557] text-white hover:bg-[#192e4b]"
          >
            Create Public User
          </button>
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
                    Story Expiry Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Password Expiry Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
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
                          <RiUserSearchFill
                            className="text-gray-400"
                            size={25}
                          />
                        </div>
                        <div className="text-center">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No public users found
                          </h3>
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
                        <div className="text-sm font-medium text-gray-900 group-hover:text-blue-900 transition-colors">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-blue-900 transition-colors">
                          {formatDate(user.storyExpiryDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-blue-900 transition-colors">
                          {formatDate(user.passwordExpiryDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center justify-start gap-1">
                        <button
                          onClick={() => openEdit(user)}
                          className="px-2 py-2 rounded-lg transition-colors text-yellow-500"
                        >
                          <RiEdit2Fill size={20} />
                        </button>
                        <button
                          onClick={() => openDelete(user._id)}
                          className="px-2 py-2 rounded-lg transition-colors text-red-800"
                        >
                          <RiDeleteBin6Fill size={20} />
                        </button>
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

      {isCreateOpen && (
        <>
          <div
            className="fixed inset-0 z-50 backdrop-blur-md bg-black/40 transition-all duration-300 ease-out"
            onClick={() => setIsCreateOpen(false)}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-w-lg w-full transform transition-all duration-300 ease-out scale-100 animate-in fade-in zoom-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl px-6 py-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Create Public User
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsCreateOpen(false)}
                    className="p-2 rounded-full hover:bg-white/50 transition-all duration-200 group"
                  >
                    <IoClose className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-600 transition-all duration-200 focus:outline-none"
                    />
                  </div>
                  {errors?.email && (
                    <p className="joi-error-message mb-4">{errors?.email[0]}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-600 transition-all duration-200 focus:outline-none"
                    />
                    <div className="absolute text-gray-400 right-3 top-1/2 transform -translate-y-1/2">
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="w-4 h-4 text-gray-500"
                      >
                        {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                      </button>
                    </div>
                  </div>
                  {errors?.password && (
                    <p className="joi-error-message mb-4">
                      {errors?.password[0]}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-600 transition-all duration-200 focus:outline-none"
                    />
                    <div className="absolute text-gray-400 right-3 top-1/2 transform -translate-y-1/2">
                      <button
                        type="button"
                        onClick={() => setShowConfirm((prev) => !prev)}
                        className="w-4 h-4 text-gray-500"
                      >
                        {showConfirm ? <IoEyeOffOutline /> : <IoEyeOutline />}
                      </button>
                    </div>
                  </div>
                  {errors?.confirmPassword && (
                    <p className="joi-error-message mb-4">
                      {errors?.confirmPassword[0]}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    Password Expiry Date
                  </label>
                  <input
                    type="date"
                    name="passwordExpiryDate"
                    value={form.passwordExpiryDate}
                    onChange={handleChange}
                    min={minDate}
                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-600 transition-all duration-200 focus:outline-none"
                  />
                  {errors?.passwordExpiryDate && (
                    <p className="joi-error-message mb-4">
                      {errors?.passwordExpiryDate[0]}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    Story Expiry Date
                  </label>
                  <input
                    type="date"
                    name="storyExpiryDate"
                    value={form.storyExpiryDate}
                    onChange={handleChange}
                    min={minDate}
                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-600 transition-all duration-200 focus:outline-none"
                  />
                  {errors?.storyExpiryDate && (
                    <p className="joi-error-message mb-4">
                      {errors?.storyExpiryDate[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <button
                    onClick={() => setIsCreateOpen(false)}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:shadow-md active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <IoClose className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>

                  <button
                    onClick={() => handleCreate()}
                    className="px-6 py-3 bg-gradient-to-r from-[#2b4e7e] to-[#1D3557] hover:from-[#1D3557] hover:to-[#192e4b] text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center justify-center space-x-2 group"
                  >
                    <IoCheckmark className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span>Create</span>
                  </button>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-indigo-400/10 to-transparent rounded-full translate-y-8 -translate-x-8"></div>
            </div>
          </div>
        </>
      )}

      {isEditOpen && (
        <>
          <div
            className="fixed inset-0 z-50 backdrop-blur-md bg-black/40 transition-all duration-300 ease-out"
            onClick={() => setIsEditOpen(false)}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-w-lg w-full transform transition-all duration-300 ease-out scale-100 animate-in fade-in zoom-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Update Public User
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsEditOpen(false)}
                    className="p-2 rounded-full hover:bg-white/50 transition-all duration-200 group"
                  >
                    <IoClose className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-600 transition-all duration-200 focus:outline-none"
                    />
                    <div className="absolute text-gray-400 right-3 top-1/2 transform -translate-y-1/2">
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="w-4 h-4 text-gray-500"
                      >
                        {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                      </button>
                    </div>
                  </div>
                  {errors?.password && (
                    <p className="joi-error-message mb-4">
                      {errors?.password[0]}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-600 transition-all duration-200 focus:outline-none"
                    />
                    <div className="absolute text-gray-400 right-3 top-1/2 transform -translate-y-1/2">
                      <button
                        type="button"
                        onClick={() => setShowConfirm((prev) => !prev)}
                        className="w-4 h-4 text-gray-500"
                      >
                        {showConfirm ? <IoEyeOffOutline /> : <IoEyeOutline />}
                      </button>
                    </div>
                  </div>
                  {errors?.confirmPassword && (
                    <p className="joi-error-message mb-4">
                      {errors?.confirmPassword[0]}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    Password Expiry Date
                  </label>
                  <input
                    type="date"
                    name="passwordExpiryDate"
                    value={form.passwordExpiryDate}
                    onChange={handleChange}
                    min={minDate}
                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-600 transition-all duration-200 focus:outline-none"
                  />
                  {errors?.passwordExpiryDate && (
                    <p className="joi-error-message mb-4">
                      {errors?.passwordExpiryDate[0]}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    Story Expiry Date
                  </label>
                  <input
                    type="date"
                    name="storyExpiryDate"
                    value={form.storyExpiryDate}
                    onChange={handleChange}
                    min={minDate}
                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-600 transition-all duration-200 focus:outline-none"
                  />
                  {errors?.storyExpiryDate && (
                    <p className="joi-error-message mb-4">
                      {errors?.storyExpiryDate[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <button
                    onClick={() => setIsEditOpen(false)}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:shadow-md active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <IoClose className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>

                  <button
                    onClick={() => handleUpdate()}
                    className="px-6 py-3 bg-gradient-to-r from-[#2b4e7e] to-[#1D3557] hover:from-[#1D3557] hover:to-[#192e4b] text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center justify-center space-x-2 group"
                  >
                    <IoCheckmark className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span>Update</span>
                  </button>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-indigo-400/10 to-transparent rounded-full translate-y-8 -translate-x-8"></div>
            </div>
          </div>
        </>
      )}

      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-start justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mt-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this public user? This action
              cannot be undone.
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
