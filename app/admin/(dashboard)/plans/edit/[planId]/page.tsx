"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import { handleSessionExpiry } from "@/utils/handleSessionExpiry";
const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

interface PlanFormData {
  name: string;
  type: string;
  price: number;
  billingCycle: string;
  allowedStories: number;
  featured: boolean;
  features: string[];
  group: string | null;
}

type Group = {
  _id: string;
  groupTag: string;
};

export default function Page() {
  const router = useRouter();
  const { planId } = useParams();
  const [groups, setGroups] = useState<Group[]>([]);
  const [formData, setFormData] = useState<PlanFormData>({
    name: "",
    type: "",
    price: 1,
    allowedStories: 1,
    billingCycle: "",
    featured: false,
    features: [],
    group: null,
  });
  const [errors, setErrors] = useState({
    name: "",
    type: "",
    price: "",
    billingCycle: "",
    allowedStories: "",
    featured: "",
    features: "",
    group: "",
  });

  const [newFeature, setNewFeature] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${serverBaseUrl}/admin/plan/${planId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (handleSessionExpiry(data.message, router, true)) return;
          toast.error(data.message || "Failed to fetch plan");
          return;
        }
        const responseData = data.response.data;

        setFormData({
          name: responseData.name || "",
          type: responseData.type || "",
          price: responseData.price || 1,
          billingCycle: responseData.billingCycle || "",
          allowedStories: responseData.allowedStories || 1,
          featured: responseData.featured || false,
          features: responseData.features || [],
          group: responseData.group?._id || null,
        });
      } catch (error) {
        console.error("Error fetching plan:", error);
        toast.error("Error loading plan");
      }
    };

    if (planId) {
      fetchPlan();
    }
  }, [planId, router]);

  useEffect(() => {
    const getAllGroups = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${serverBaseUrl}/admin/group/all`, {
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
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch groups");
      } finally {
        setLoading(false);
      }
    };
    getAllGroups();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";

    if (name === "price" || name === "allowedStories") {
      const numericValue = Number(value);
      if (numericValue > 1000000) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        isCheckbox && e.target instanceof HTMLInputElement
          ? e.target.checked
          : name === "group" && value === ""
          ? null
          : value,
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((feature) => feature !== featureToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({
      name: "",
      type: "",
      price: "",
      billingCycle: "",
      allowedStories: "",
      featured: "",
      features: "",
      group: "",
    });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${serverBaseUrl}/admin/plan/${planId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
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
          toast.error(data.message || "Failed to update plan");
          return;
        }
      }

      toast.success(data.message);
      router.push("/admin/plans");
    } catch (error) {
      console.error("Error updating plan:", error);
      toast.error("Failed to update plan");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/plans");
  };

  return (
    <main className="flex-1 p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mb-2">
            Update Plans
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Plan Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors"
                placeholder="Enter plan name"
              />
              {errors?.name && (
                <p className="joi-error-message mb-4">{errors?.name[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Plan Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors cursor-pointer"
              >
                <option value="" disabled>
                  Select Type
                </option>
                <option value="DIY">DIY</option>
                <option value="DWY">DWY</option>
                <option value="DFY">DFY</option>
              </select>
              {errors?.type && (
                <p className="joi-error-message mb-4">{errors?.type[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Plan Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
                    !["Backspace", "ArrowLeft", "ArrowRight", "Tab"].includes(
                      e.key
                    )
                  ) {
                    e.preventDefault();
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors"
                placeholder="Enter plan price"
              />
              {errors?.price && (
                <p className="joi-error-message mb-4">{errors?.price[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="billingCycle"
                className="block text-sm font-medium text-gray-700"
              >
                Billing Cycle
              </label>
              <select
                id="billingCycle"
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors cursor-pointer"
              >
                <option value="" disabled>
                  Select billing cycle
                </option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              {errors?.billingCycle && (
                <p className="joi-error-message mb-4">
                  {errors?.billingCycle[0]}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="allowedStories"
                className="block text-sm font-medium text-gray-700"
              >
                Allowed Stories
              </label>
              <input
                type="number"
                id="allowedStories"
                name="allowedStories"
                value={formData.allowedStories}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
                    !["Backspace", "ArrowLeft", "ArrowRight", "Tab"].includes(
                      e.key
                    )
                  ) {
                    e.preventDefault();
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors"
                placeholder="Enter allowed stories"
              />
              {errors?.allowedStories && (
                <p className="joi-error-message mb-4">
                  {errors?.allowedStories[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Featured Plan
              </label>
              <div className="flex items-center space-x-3 pt-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm text-gray-700">
                    {formData.featured ? "Featured" : "Not Featured"}
                  </span>
                </label>
              </div>
              {errors?.featured && (
                <p className="joi-error-message mb-4">{errors?.featured[0]}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Plan Features
            </label>

            <div className="flex gap-3">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-3 border border-[#1D3557] rounded-lg transition-colors"
                placeholder="Add a feature..."
              />
              <button
                type="button"
                onClick={addFeature}
                disabled={!newFeature.trim()}
                className="px-4 py-1 rounded-lg font-medium bg-[#1D3557] text-white hover:bg-[#192e4b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>
            {errors?.features && (
              <p className="joi-error-message mb-4">{errors?.features[0]}</p>
            )}

            {formData.features.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Features ({formData.features.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-[#1d35571b] text-[#1D3557] rounded-full text-sm"
                    >
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="text-[#1D3557] hover:text-[#192e4b] transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label
              htmlFor="group"
              className="block text-sm font-medium text-gray-700"
            >
              Group
            </label>
            <select
              id="group"
              name="group"
              value={formData.group ?? ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors cursor-pointer"
            >
              <option value="">Select Group</option>
              {groups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.groupTag}
                </option>
              ))}
            </select>
            {errors?.group && (
              <p className="joi-error-message mb-4">{errors?.group[0]}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg font-medium bg-red-800 text-white hover:bg-red-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg font-medium bg-[#1D3557] text-white hover:bg-[#192e4b] transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                "Update Plan"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
