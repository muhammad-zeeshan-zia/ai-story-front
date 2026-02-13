"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaCrown } from "react-icons/fa";
import { RiAddLine, RiDeleteBinLine, RiEdit2Fill } from "react-icons/ri";
import { handleSessionExpiry } from "@/utils/handleSessionExpiry";
const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

type Plan = {
  _id: string;
  name: string;
  type: string;
  price: number;
  billingCycle: string;
  allowedStories: number;
  group: { _id: string; groupTag: string };
};

export default function Page() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [disabledDelete, setDisabledDelete] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  const loadPlans = async (pg: number = page, pgSize: number = pageSize) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pg),
        pageSize: String(pgSize),
      });
      const token = localStorage.getItem("token");
      const res = await fetch(`${serverBaseUrl}/admin/plan/?${params}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        if (handleSessionExpiry(data.message, router, true)) return;
        toast.error(data.message || "Failed to fetch plans");
        return;
      }

      setPlans(data?.response?.data?.plans);
      setTotal(data?.response?.data?.total);
      setPage(data?.response?.data?.page);
      setPageSize(data?.response?.data?.pageSize);
      setTotalPages(data?.response?.data?.totalPages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (planId: string) => {
    setDisabledDelete(planId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${serverBaseUrl}/admin/plan/${planId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        if (handleSessionExpiry(data.message, router, true)) return;
        toast.error(data.message || "Failed to delete plan");
        return;
      }
      toast.success("Plan deleted successfully");
      await loadPlans();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete plan");
    } finally {
      setDisabledDelete(null);
    }
  };

  useEffect(() => {
    const getPlans = async () => {
      await loadPlans();
    };
    getPlans();
  }, []);

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    await loadPlans(newPage, pageSize);
  };

  const onPrev = async () => {
    if (page > 1) {
      setPage(page - 1);
      await loadPlans(page - 1, pageSize);
    }
  };

  const onNext = async () => {
    if (page < totalPages) {
      setPage(page + 1);
      await loadPlans(page + 1, pageSize);
    }
  };

  const createPlan = () => {
    router.push("/admin/plans/create");
  };

  const updatePlan = (planId: string) => {
    router.push(`/admin/plans/edit/${planId}`);
  };

  return (
    <main className="flex-1 p-3 md:p-4 lg:p-8 bg-gray-50 min-h-screen overflow-x-auto">
      <div className="max-w-[1440px] mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mb-2">
            Plan Management
          </h1>
        </div>

        <div className="flex mb-6 items-end justify-end">
          <button
            onClick={() => createPlan()}
            className="flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors bg-[#1D3557] text-white hover:bg-[#192e4b]"
          >
            <RiAddLine size={20} /> Add Plan
          </button>
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
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cycle
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stories
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Group
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
                ) : plans?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <FaCrown className="text-gray-400" size={25} />
                        </div>
                        <div className="text-center">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No plans found
                          </h3>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  plans?.map((plan) => (
                    <tr
                      key={plan._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-blue-900 transition-colors">
                          {plan.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 group-hover:bg-blue-100 group-hover:text-blue-800 transition-all duration-200">
                          {plan.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <span className="text-lg font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                            ${plan.price}
                          </span>
                          <span className="text-xs text-gray-500">
                            /{plan.billingCycle === "monthly" ? "mo" : "yr"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                              plan.billingCycle === "monthly"
                                ? "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200 group-hover:shadow-sm"
                                : "bg-purple-100 text-purple-700 group-hover:bg-purple-200 group-hover:shadow-sm"
                            }`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                plan.billingCycle === "monthly"
                                  ? "bg-emerald-500"
                                  : "bg-purple-500"
                              }`}
                            ></div>
                            {plan.billingCycle}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors max-w-xs  ">
                          <div className="line-clamp-2 ps-6">
                            {plan.allowedStories}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-blue-900 transition-colors">
                          {plan.group?.groupTag ?? "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center justify-start gap-1">
                        <button
                          onClick={() => updatePlan(plan._id)}
                          className="px-2 py-2 rounded-lg transition-colors text-yellow-500"
                        >
                          <RiEdit2Fill size={20} />
                        </button>
                        <button
                          onClick={() => {
                            setPlanToDelete(plan._id);
                            setShowDeleteModal(true);
                          }}
                          className="px-2 py-2 rounded-lg transition-colors text-red-800"
                          disabled={disabledDelete === plan._id}
                        >
                          <RiDeleteBinLine size={20} />
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
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-start justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mt-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this plan? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (planToDelete) await handleDelete(planToDelete);
                  setShowDeleteModal(false);
                  setPlanToDelete(null);
                }}
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
