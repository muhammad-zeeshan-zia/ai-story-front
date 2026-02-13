"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CiLock } from "react-icons/ci";
import { BiEdit } from "react-icons/bi";
import { RiEdit2Fill } from "react-icons/ri";
import { HiOutlineTag } from "react-icons/hi2";
import {
  IoCodeSlashOutline,
  IoClose,
  IoCheckmark,
  IoEyeOutline,
} from "react-icons/io5";
import { handleSessionExpiry } from "@/utils/handleSessionExpiry";
const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

type Prompt = {
  _id: string;
  name: string;
  prompt: string;
};

export default function Page() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [editedPrompt, setEditedPrompt] = useState("");
  const [viewPrompt, setViewPrompt] = useState<Prompt | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [errors, setErrors] = useState({
    prompt: "",
  });

  const loadPrompts = async (pg: number = page, pgSize: number = pageSize) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pg),
        pageSize: String(pgSize),
      });
      const token = localStorage.getItem("token");
      const res = await fetch(`${serverBaseUrl}/admin/prompt/?${params}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        if (handleSessionExpiry(data.message, router, true)) return;
        toast.error(data.message || "Failed to fetch prompts");
        return;
      }

      setPrompts(data?.response?.data?.prompts);
      setTotal(data?.response?.data?.total);
      setPage(data?.response?.data?.page);
      setPageSize(data?.response?.data?.pageSize);
      setTotalPages(data?.response?.data?.totalPages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch prompts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getPrompts = async () => {
      await loadPrompts();
    };
    getPrompts();
  }, []);

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    await loadPrompts(newPage, pageSize);
  };

  const onPrev = async () => {
    if (page > 1) {
      setPage(page - 1);
      await loadPrompts(page - 1, pageSize);
    }
  };

  const onNext = async () => {
    if (page < totalPages) {
      setPage(page + 1);
      await loadPrompts(page + 1, pageSize);
    }
  };

  const updatePrompt = (promptId: string) => {
    const prompt = prompts.find((p) => p._id === promptId);
    if (prompt) {
      setSelectedPrompt(prompt);
      setEditedPrompt(prompt.prompt);
      setIsModalOpen(true);
    }
  };

  const handleUpdate = async (promptId: string) => {
    setLoading(true);
    setErrors({
      prompt: "",
    });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${serverBaseUrl}/admin/prompt/${promptId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ prompt: editedPrompt }),
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
          toast.error(data.message || "Failed to update prompt");
          return;
        }
      }

      toast.success(data.message);
      setIsModalOpen(false);
      await loadPrompts();
    } catch (error) {
      console.error("Error updating prompt:", error);
      toast.error("Failed to update prompt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 p-3 md:p-4 lg:p-8 bg-gray-50 min-h-screen overflow-x-auto">
      <div className="max-w-[1440px] mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mb-2">
            Prompt Management
          </h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prompt
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
                ) : prompts?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <IoCodeSlashOutline
                            className="text-gray-400"
                            size={25}
                          />
                        </div>
                        <div className="text-center">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No prompts found
                          </h3>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  prompts?.map((prompt) => (
                    <tr
                      key={prompt._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-blue-900 transition-colors">
                          {prompt.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors max-w-xs">
                          <div className="line-clamp-2">{prompt.prompt}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center justify-start gap-1">
                        <button
                          onClick={() => {
                            setViewPrompt(prompt);
                            setIsViewOpen(true);
                          }}
                          className="px-2 py-2 rounded-lg transition-colors text-green-800"
                        >
                          <IoEyeOutline size={20} />
                        </button>
                        <button
                          onClick={() => updatePrompt(prompt._id)}
                          className="px-2 py-2 rounded-lg transition-colors text-yellow-500"
                        >
                          <RiEdit2Fill size={20} />
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

      {isModalOpen && selectedPrompt && (
        <>
          <div
            className="fixed inset-0 z-50 backdrop-blur-md bg-black/40 transition-all duration-300 ease-out"
            onClick={() => setIsModalOpen(false)}
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
                      Edit Prompt
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-full hover:bg-white/50 transition-all duration-200 group"
                  >
                    <IoClose className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <HiOutlineTag className="w-4 h-4 text-gray-500" />
                    <span>Prompt Name</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedPrompt.name}
                      disabled
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed transition-all duration-200 focus:outline-none"
                    />
                    <div className="absolute text-gray-400 right-3 top-1/2 transform -translate-y-1/2">
                      <CiLock className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BiEdit className="w-4 h-4 text-gray-500" />
                      <span>Prompt Content</span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {editedPrompt.length} chars
                    </span>
                  </label>
                  <div className="relative">
                    <textarea
                      rows={5}
                      value={editedPrompt}
                      onChange={(e) => setEditedPrompt(e.target.value)}
                      className="w-full text-gray-800 px-4 py-3 border border-gray-200 rounded-xl resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 hover:border-gray-300"
                      placeholder="Enter your prompt content here..."
                    />
                    <div className="absolute bottom-3 right-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  {errors?.prompt && (
                    <p className="joi-error-message mb-4">
                      {errors?.prompt[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:shadow-md active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <IoClose className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>

                  <button
                    onClick={() => handleUpdate(selectedPrompt._id)}
                    className="px-6 py-3 bg-gradient-to-r from-[#2b4e7e] to-[#1D3557] hover:from-[#1D3557] hover:to-[#192e4b] text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center justify-center space-x-2 group"
                  >
                    <IoCheckmark className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-indigo-400/10 to-transparent rounded-full translate-y-8 -translate-x-8"></div>
            </div>
          </div>
        </>
      )}

      {isViewOpen && viewPrompt && (
        <>
          <div
            className="fixed inset-0 z-50 backdrop-blur-md bg-black/40 transition-all duration-300 ease-out"
            onClick={() => setIsViewOpen(false)}
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
                      View Prompt
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsViewOpen(false)}
                    className="p-2 rounded-full hover:bg-white/50 transition-all duration-200 group"
                  >
                    <IoClose className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <CiLock className="w-4 h-4 text-gray-500" />
                    <span>Prompt Name</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={viewPrompt.name}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-600 transition-all duration-200 focus:outline-none"
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CiLock className="w-4 h-4 text-gray-500" />
                      <span>Prompt Content</span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {viewPrompt.prompt.length} chars
                    </span>
                  </label>
                  <div className="relative">
                    <textarea
                      rows={5}
                      value={viewPrompt.prompt}
                      className="w-full text-gray-800 px-4 py-3 border border-gray-200 rounded-xl resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 hover:border-gray-300"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <button
                    onClick={() => setIsViewOpen(false)}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:shadow-md active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <IoClose className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-indigo-400/10 to-transparent rounded-full translate-y-8 -translate-x-8"></div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

