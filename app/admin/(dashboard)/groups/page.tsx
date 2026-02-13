"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IoClose, IoCheckmark } from "react-icons/io5";
import {
  RiDeleteBin6Fill,
  RiEdit2Fill,
  RiUserSearchFill,
  RiUserSettingsLine,
} from "react-icons/ri";
import { handleSessionExpiry } from "@/utils/handleSessionExpiry";
import { MdOutlineRemoveCircle } from "react-icons/md";
const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

type UserInGroup = {
  _id: string;
  email: string;
};

type Group = {
  _id: string;
  groupTag: string;
  name: string;
  users?: UserInGroup[];
};

type SimpleUser = {
  _id: string;
  email: string;
};

export default function GroupManagement() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewMembersOpen, setIsViewMembersOpen] = useState(false);
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [viewMemberLoading, setViewMemberLoading] = useState(false);

  const [groupId, setGroupId] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<UserInGroup[]>([]);
  const [allUsers, setAllUsers] = useState<SimpleUser[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<
    Record<string, boolean>
  >({});
  const [form, setForm] = useState({
    groupTag: "",
    name: "",
  });
  const [errors, setErrors] = useState({
    groupTag: "",
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const loadGroups = async (pg: number = page, pgSize: number = pageSize) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pg),
        pageSize: String(pgSize),
      });
      const token = localStorage.getItem("token");
      const res = await fetch(`${serverBaseUrl}/admin/group?${params}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        if (handleSessionExpiry(data.message, router, true)) return;
        toast.error(data.message || "Failed to fetch groups");
        return;
      }

      setGroups(data?.response?.data?.groups);
      setTotal(data?.response?.data?.total);
      setPage(data?.response?.data?.page);
      setPageSize(data?.response?.data?.pageSize);
      setTotalPages(data?.response?.data?.totalPages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getGroups = async () => {
      await loadGroups();
    };
    getGroups();
  }, []);

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    await loadGroups(newPage, pageSize);
  };

  const onPrev = async () => {
    if (page > 1) {
      setPage(page - 1);
      await loadGroups(page - 1, pageSize);
    }
  };

  const onNext = async () => {
    if (page < totalPages) {
      setPage(page + 1);
      await loadGroups(page + 1, pageSize);
    }
  };

  const openCreate = () => {
    setForm({ groupTag: "", name: "" });
    setErrors({ groupTag: "", name: "" });
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setIsCreateOpen(true);
  };

  const handleCreate = async () => {
    setLoading(true);
    setErrors({ groupTag: "", name: "" });

    if (!form.groupTag?.trim() || !form.name?.trim()) {
      setErrors({
        groupTag: !form.groupTag?.trim() ? "Group tag is required" : "",
        name: !form.name?.trim() ? "Group name is required" : "",
      });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${serverBaseUrl}/admin/group/`, {
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
        if (response.status === 409) {
          toast.error(data.message || "Group with same tag already exists");
          return;
        }
        if (response.status === 403 && typeof data.error === "object") {
          setErrors(data.error);
          return;
        }
        toast.error(data.message || "Failed to create group");
        return;
      }

      toast.success(data.message || "Group created");
      await loadGroups(1, pageSize);
      setIsCreateOpen(false);
      setForm({ groupTag: "", name: "" });
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group");
    } finally {
      await loadGroups();
      setLoading(false);
    }
  };

  const openEdit = (g: Group) => {
    setForm({
      groupTag: g.groupTag || "",
      name: g.name || "",
    });
    setErrors({ groupTag: "", name: "" });
    setGroupId(g._id);
    setIsCreateOpen(false);
    setIsDeleteOpen(false);
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!groupId) return;
    setLoading(true);
    setErrors({ groupTag: "", name: "" });

    if (!form.groupTag?.trim() || !form.name?.trim()) {
      setErrors({
        groupTag: !form.groupTag?.trim() ? "Group tag is required" : "",
        name: !form.name?.trim() ? "Group name is required" : "",
      });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${serverBaseUrl}/admin/group/${groupId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        if (handleSessionExpiry(data.message, router, true)) return;
        if (response.status === 403 && typeof data.error === "object") {
          setErrors(data.error);
          return;
        }
        toast.error(data.message || "Failed to update group");
        return;
      }

      toast.success(data.message || "Group updated");
      await loadGroups(page, pageSize);
      setIsEditOpen(false);
      setForm({ groupTag: "", name: "" });
    } catch (error) {
      console.error("Error updating group:", error);
      toast.error("Failed to update group");
    } finally {
      await loadGroups();
      setLoading(false);
    }
  };

  const openDelete = (id: string) => {
    setGroupId(id);
    setIsCreateOpen(false);
    setIsEditOpen(false);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${serverBaseUrl}/admin/group/${groupId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        if (handleSessionExpiry(data.message, router, true)) return;
        toast.error(data.message || "Failed to delete group");
        return;
      }

      toast.success(data.message || "Group deleted");
      setIsDeleteOpen(false);
      await loadGroups(page, pageSize);
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error("Failed to delete group");
    } finally {
      await loadGroups();
      setLoading(false);
    }
  };

  const handleViewMembers = (g: Group) => {
    setGroupId(g._id);
    setSelectedMembers(g.users || []);
    setIsViewMembersOpen(true);
  };

  const openManageMembers = async (g: Group) => {
    setGroupId(g._id);
    setUsersLoading(true);
    setSelectedMembers(g.users || []);
    setIsManageMembersOpen(true);
    setSelectedUserIds({});

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${serverBaseUrl}/admin/group/users`, {
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

      const usersList: SimpleUser[] = data?.response?.data?.users;
      setAllUsers(usersList);

      const preChecked: Record<string, boolean> = {};
      (g.users || []).forEach((u) => {
        preChecked[u._id] = true;
      });
      setSelectedUserIds(preChecked);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleSaveMembers = async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const selected = Object.keys(selectedUserIds).filter(
        (id) => selectedUserIds[id]
      );

      const response = await fetch(
        `${serverBaseUrl}/admin/group/${groupId}/add-users`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userIds: selected }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        if (handleSessionExpiry(data.message, router, true)) return;
        toast.error(data.message || "Failed to update group members");
        return;
      }

      toast.success(data.message || "Group members updated");
      await loadGroups(page, pageSize);
      setIsManageMembersOpen(false);
    } catch (err) {
      console.error("Failed to save members:", err);
      toast.error("Failed to update group members");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (groupId: string, userId: string) => {
    setViewMemberLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${serverBaseUrl}/admin/group/${groupId}/remove-user`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        if (handleSessionExpiry(data.message, router, true)) return;
        toast.error(data.message || "Failed to remove member");
        return;
      }
      toast.success(data.message || "Member removed");
      await loadGroups(page, pageSize);
      setSelectedMembers((prev) => prev.filter((m) => m._id !== userId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove member");
    } finally {
      setViewMemberLoading(false);
    }
  };

  return (
    <main className="flex-1 p-3 md:p-4 lg:p-8 bg-gray-50 min-h-screen overflow-x-auto">
      <div className="max-w-[1440px] mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mb-2">
            Groups Management
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-end">
          <button
            onClick={() => openCreate()}
            className="px-4 py-2 rounded-lg font-medium transition-colors bg-[#1D3557] text-white hover:bg-[#192e4b]"
          >
            Create Group
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Group Tag
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Members
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
                ) : groups?.length === 0 ? (
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
                            No groups found
                          </h3>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  groups.map((g) => (
                    <tr
                      key={g._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {g.groupTag}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {g.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {g.users?.length ?? 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center justify-start gap-1">
                        <button
                          onClick={() => handleViewMembers(g)}
                          title="View members"
                          aria-label="View members"
                          className="px-2 py-2 rounded-lg transition-colors text-blue-600 hover:bg-blue-50"
                        >
                          <RiUserSearchFill size={18} />
                        </button>
                        <button
                          onClick={() => openManageMembers(g)}
                          title="Manage members"
                          aria-label="Manage members"
                          className="px-2 py-2 rounded-lg transition-colors text-green-600 hover:bg-green-50"
                        >
                          <RiUserSettingsLine size={18} />
                        </button>
                        <button
                          onClick={() => openEdit(g)}
                          className="px-2 py-2 rounded-lg transition-colors text-yellow-500"
                          title="Edit"
                        >
                          <RiEdit2Fill size={20} />
                        </button>
                        <button
                          onClick={() => openDelete(g._id)}
                          className="px-2 py-2 rounded-lg transition-colors text-red-800"
                          title="Delete"
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
                      Create Group
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
                  <label className="text-sm font-semibold text-gray-700">
                    Group Tag
                  </label>
                  <input
                    name="groupTag"
                    value={form.groupTag}
                    onChange={handleChange}
                    placeholder="e.g. family-smith"
                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-600"
                  />
                  {errors?.groupTag && (
                    <p className="joi-error-message mb-4">{errors.groupTag}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">
                    Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Family Smith"
                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-600"
                  />
                  {errors?.name && (
                    <p className="joi-error-message mb-4">{errors.name}</p>
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
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-[#2b4e7e] to-[#1D3557] text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center justify-center space-x-2 group"
                  >
                    <IoCheckmark className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span>Create</span>
                  </button>
                </div>
              </div>
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
                      Update Group
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
                  <label className="text-sm font-semibold text-gray-700">
                    Group Tag
                  </label>
                  <input
                    name="groupTag"
                    value={form.groupTag}
                    onChange={handleChange}
                    placeholder="e.g. family-smith"
                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-600"
                  />
                  {errors?.groupTag && (
                    <p className="joi-error-message mb-4">{errors.groupTag}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">
                    Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Family Smith"
                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-600"
                  />
                  {errors?.name && (
                    <p className="joi-error-message mb-4">{errors.name}</p>
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
                    className="px-6 py-3 bg-gradient-to-r from-[#2b4e7e] to-[#1D3557] text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center justify-center space-x-2 group"
                  >
                    <IoCheckmark className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span>Update</span>
                  </button>
                </div>
              </div>
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
              Are you sure you want to delete this group? This action cannot be
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
                onClick={() => handleDelete()}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isViewMembersOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsViewMembersOpen(false)}
        >
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200/50 max-w-lg w-full p-8 transform transition-all duration-300">
              {viewMemberLoading ? (
                <div className="flex items-center justify-center">
                  <div
                    role="status"
                    aria-live="polite"
                    className="flex items-center"
                  >
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Group Members
                    </h3>
                    <button
                      onClick={() => setIsViewMembersOpen(false)}
                      className="p-2 rounded-full bg-gray-100 hover:bg-red-100 transition-all duration-200 group"
                    >
                      <IoClose className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                  <div className="space-y-3 max-h-72 overflow-auto">
                    {selectedMembers.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </div>
                        <div className="text-gray-500 font-medium">
                          No members in this group
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          Add members to get started
                        </div>
                      </div>
                    ) : (
                      selectedMembers.map((m) => (
                        <div
                          key={m._id}
                          className="group flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-blue-200"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex-shrink-0 flex items-center justify-center text-white font-semibold text-sm">
                              {m.email.charAt(0).toUpperCase()}
                            </div>

                            <div
                              className="font-medium text-gray-900 truncate"
                              title={m.email}
                            >
                              {m.email}
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              handleRemoveMember(groupId ?? "", m._id)
                            }
                            disabled={loading}
                            className="ml-4 flex-none px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
                            aria-label={`Remove ${m.email}`}
                          >
                            <MdOutlineRemoveCircle size={28} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isManageMembersOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsManageMembersOpen(false)}
        >
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200/50 max-w-2xl w-full p-8 transform transition-all duration-300">
              {usersLoading ? (
                <div className="flex items-center justify-center">
                  <div
                    role="status"
                    aria-live="polite"
                    className="flex items-center"
                  >
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Manage Group Members
                    </h3>
                    <button
                      onClick={() => setIsManageMembersOpen(false)}
                      className="p-2 rounded-full bg-gray-100 hover:bg-red-100 transition-all duration-200 group"
                    >
                      <IoClose className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                    </button>
                  </div>

                  <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="text-blue-800 font-medium text-sm">
                        Select users to include in this group, then click Save
                        to apply changes.
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-auto mb-6 p-1">
                    {allUsers.length === 0 ? (
                      <div className="col-span-2 flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                            />
                          </svg>
                        </div>
                        <div className="text-gray-500 font-medium">
                          No users available
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          Users will appear here once registered
                        </div>
                      </div>
                    ) : (
                      allUsers.map((u) => (
                        <label
                          key={u._id}
                          className="group flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer"
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={!!selectedUserIds[u._id]}
                              onChange={() => toggleUserSelection(u._id)}
                              className="w-5 h-5 text-blue-600 rounded border-2 border-gray-300 focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                            />
                          </div>
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="min-w-8 min-h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                              {u.email.charAt(0).toUpperCase()}
                            </div>

                            <div
                              className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors truncate"
                              title={u.email}
                            >
                              {u.email}
                            </div>
                          </div>
                        </label>
                      ))
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setIsManageMembersOpen(false)}
                      className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 hover:shadow-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveMembers()}
                      disabled={loading}
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
                    >
                      Save Changes
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
