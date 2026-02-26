"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiUsers } from "react-icons/fi";
import { Users, BookOpen, Loader2, Crown } from "lucide-react";
import { toast } from "sonner";
import { handleSessionExpiry } from "@/utils/handleSessionExpiry";
import { FaCrown } from "react-icons/fa";
const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

type User = {
  _id: string;
  email: string;
  plan: string;
  status: string;
  planName: string;
  expiryDate: Date;
};

type Plan = {
  _id: string;
  name: string;
  type: string;
  price: number;
  billingCycle: string;
};

interface UserPlanRowProps {
  planName: string | null;
  expiryDate: string | Date | null;
}


export default function Page() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStories, setTotalStories] = useState(0);
  const [totalActivePlans, setTotalActivePlans] = useState(0);
  const [loading, setLoading] = useState(false);

  const getDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${serverBaseUrl}/admin/user/dashboard`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        if (handleSessionExpiry(data.message, router, true)) return;
        toast.error(data.message || "Failed to fetch dashboard data");
        return;
      }

      setUsers(data?.response?.data?.users);
      setPlans(data?.response?.data?.plans);
      setTotalUsers(data?.response?.data?.totalUsers);
      setTotalActivePlans(data?.response?.data?.totalActivePlans);
      setTotalStories(data?.response?.data?.totalStories);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      await getDashboardData();
    };
    getData();
  }, []);

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

  const statsData = [
    {
      label: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: Users,
      gradient: "from-blue-500 to-cyan-400",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      label: "Active Pro Plans",
      value: totalActivePlans.toString(),
      icon: Crown,
      gradient: "from-purple-500 to-pink-400",
      bgGradient: "from-purple-50 to-pink-50",
    },
    {
      label: "Total Stories Generated",
      value: totalStories.toLocaleString(),
      icon: BookOpen,
      gradient: "from-amber-500 to-orange-400",
      bgGradient: "from-amber-50 to-orange-50",
    },
  ];

  return (
    <main className="flex-1 p-3 md:p-4 lg:p-8 bg-gray-50 min-h-screen overflow-x-auto">
      <div className="max-w-[1440px] mx-auto w-full">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-slate-900 tracking-tight mb-2">
            Welcome back, AI Story Admin Panel
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-slate-600 max-w-3xl">
            Track, manage and forecast your customers and orders.
          </p>
        </div>

        <div className="w-full max-w-7xl mx-auto pb-4 px-4 md:pb-6 mx:pb-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {statsData.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className={`
                    relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.bgGradient}
                    border border-white/20 backdrop-blur-sm
                    hover:scale-[1.02] hover:shadow-xl hover:shadow-black/10
                    transition-all duration-300 ease-out
                    group cursor-pointer
                  `}
                >
                  <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-300">
                    <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-white to-transparent"></div>
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-gradient-to-tr from-white to-transparent"></div>
                  </div>

                  <div className="relative p-6 md:p-8">
                    <div className="mb-4 md:mb-6">
                      <div
                        className={`
                          p-3 md:p-4 rounded-xl bg-gradient-to-br ${stat.gradient}
                          shadow-lg group-hover:shadow-xl transition-shadow duration-300
                          inline-block
                        `}
                      >
                        <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                    </div>

                    <div className="space-y-2 md:space-y-3">
                      <h3 className="text-xs md:text-sm font-medium text-slate-600 tracking-wide uppercase">
                        {stat.label}
                      </h3>
                      <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-none">
                        {stat.value}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`
                      absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.gradient}
                      opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none
                    `}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
          <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
            <div className="flex-1 bg-white rounded-2xl border border-gray-200/60 shadow-lg shadow-gray-100/50 overflow-hidden backdrop-blur-sm">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200/60">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiUsers className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Users Management
                    </h3>
                    <p className="text-sm text-gray-600">
                      Manage user accounts
                    </p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50/80 border-b border-gray-200/60">
                    <tr>
                      <th className="px-3 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-3 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-3 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-3 md:px-6 py-12 text-center"
                        >
                          <div className="flex justify-center items-center gap-3">
                            <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
                            <span className="text-gray-600">
                              Loading users...
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : users?.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-3 md:px-6 py-12 text-center"
                        >
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                              <Users className="text-gray-400 w-6 h-6" />
                            </div>
                            <div className="text-center">
                              <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No users found
                              </h3>
                              <p className="text-gray-500">
                                Users will appear here once they register
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      users?.map((user) => (
                        <tr
                          key={user._id}
                          className="hover:bg-gray-50/50 transition-all duration-200 group"
                        >
                          <td className="px-3 md:px-6 py-4">
                            <div className="text-sm text-gray-900 font-medium truncate max-w-[200px]">
                              {user.email}
                            </div>
                          </td>
                          <UserPlanRow
                            planName={user.planName}
                            expiryDate={user.expiryDate}
                          />
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                                user.status === "blocked"
                                  ? "bg-red-100 text-red-700"
                                  : user.status === "active"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-200/60 flex items-center justify-center">
                <button
                  onClick={() => router.push("/admin/users")}
                  className="px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-[1.02]"
                >
                  Explore All Users
                </button>
              </div>
            </div>

            <div className="flex-1 bg-white rounded-2xl border border-gray-200/60 shadow-lg shadow-gray-100/50 overflow-hidden backdrop-blur-sm">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200/60">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FaCrown className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Subscription Plans
                    </h3>
                    <p className="text-sm text-gray-600">
                      Manage pricing and plan features
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50/80 border-b border-gray-200/60">
                    <tr>
                      <th className="px-3 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-3 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-3 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-3 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Billing Cycle
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-3 md:px-6 py-12 text-center"
                        >
                          <div className="flex justify-center items-center gap-3">
                            <Loader2 className="animate-spin h-6 w-6 text-purple-600" />
                            <span className="text-gray-600">
                              Loading plans...
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : plans?.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-3 md:px-6 py-12 text-center"
                        >
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                              <FaCrown className="text-gray-400 w-6 h-6" />
                            </div>
                            <div className="text-center">
                              <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No plans found
                              </h3>
                              <p className="text-gray-500">
                                Subscription plans will appear here
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      plans?.map((plan) => (
                        <tr
                          key={plan._id}
                          className="hover:bg-gray-50/50 transition-all duration-200 group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900 transition-colors">
                              {plan.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 duration-200">
                              {plan.type}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-lg font-bold text-gray-900">
                              ${plan.price}
                            </span>
                            <span className="text-xs text-gray-500">
                              /{plan.billingCycle === "monthly" ? "mo" : "yr"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                                plan.billingCycle === "monthly"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-purple-100 text-purple-700"
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
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-200/60 flex items-center justify-center">
                <button
                  onClick={() => router.push("/admin/plans")}
                  className="px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-[1.02]"
                >
                  Explore All Plans
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
