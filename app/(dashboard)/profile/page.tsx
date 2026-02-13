"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StoryImagePanel from "@/components/ui/StoryImagePanel";
import InputField from "@/components/ui/InputField";
import ActionRequiredModal from "@/components/ui/ActionRequiredModal";
import { ProtectedUserRoute } from "@/utils/RouteProtection";
import { handleSessionExpiry } from "@/utils/handleSessionExpiry";
import { toast } from "sonner";
const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

type Subscription = {
  name: string;
  expiryDate: string;
  subscriptionFound: boolean;
};

const Profile = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [subscription, setSubscription] = useState<Subscription>({
    name: "",
    expiryDate: "",
    subscriptionFound: false,
  });
  const [email, setEmail] = useState<string>("");
  useEffect(() => {
    fetchSubscription();
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setEmail(user.email);
    }
  }, []);

  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${serverBaseUrl}/user/plan/subscription`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        if (handleSessionExpiry(data.message, router)) return;
        const msg = data.message || "Failed to fetch plans";
        return toast.error(msg);
      } else {
        const info = data.response;
        setSubscription({
          name: info.planName + " - " + info.planType,
          expiryDate: new Date(info.expiryDate).toISOString().slice(0, 10),
          subscriptionFound: true,
        });
      }
    } catch {
      toast.error("Failed to fetch plans");
    }
  };

  return (
    <ProtectedUserRoute>
      <div className="min-h-screen flex flex-col lg:flex-row justify-between gap-6 lg:gap-10 font-inter p-6 sm:p-8 lg:p-10 bg-[#fdfdfd] w-full">
        {/* Left Panel (User Info) */}
        <div className="w-full lg:w-1/2 flex flex-col space-y-6">
          <h1 className="text-3xl sm:text-4xl text-[#1D3557] font-[Cormorant_Garamond] font-bold">
            General Info
          </h1>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <InputField
              label="Email"
              type="email"
              value={email}
              placeholder="write your email..."
              id="email"
              disabled={true}
            />
            <button
              onClick={() => router.push("/change-password")}
              className="bg-[#A8DADC] hover:bg-[#7FB8C4] text-[#457B9D] hover:text-[#2F4757] font-semibold w-full sm:w-48 py-3 rounded-full transition-colors"
            >
              Change Password
            </button>

            <div className="space-y-2 pt-2">
              <h1 className="text-3xl sm:text-4xl text-[#1D3557] font-[Cormorant_Garamond] font-bold">
                Subscription Info
              </h1>
              {subscription.subscriptionFound ? (
                <p className="text-[#457B9D] text-sm">
                  *For Privacy, all stories are removed at end of subscription.
                  Please Printout, Copy and Save Stories to your computer
                </p>
              ) : (
                <>
                  <p className="text-[#457B9D] text-sm">
                    No subscription found
                  </p>
                  <button
                    onClick={() => router.push("/select-plan")}
                    className="bg-[#A8DADC] hover:bg-[#7FB8C4] text-[#457B9D] hover:text-[#2F4757] font-semibold w-full sm:w-48 py-3 rounded-full transition-colors"
                  >
                    Buy a plan
                  </button>
                </>
              )}
            </div>

            {subscription.subscriptionFound && (
              <>
                <InputField
                  label="Current Plan"
                  type="text"
                  value={subscription.name}
                  placeholder="Your plan"
                  id="plan"
                  disabled={true}
                />

                <InputField
                  label="Expiry Date"
                  type="date"
                  value={subscription.expiryDate}
                  placeholder="subscription expiry date"
                  id="expiry-date"
                  disabled={true}
                />
              </>
            )}
          </form>
        </div>

        <StoryImagePanel />

        {/* Modal */}
        {showModal && (
          <ActionRequiredModal onClose={() => setShowModal(false)} />
        )}
      </div>
    </ProtectedUserRoute>
  );
};

export default Profile;
