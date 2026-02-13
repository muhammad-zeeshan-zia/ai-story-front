"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import PricingCard from "@/components/ui/PricingCard";
const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

const PricingSection = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${serverBaseUrl}/user/plan/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        const msg = data.message || "Failed to fetch plans";
        return toast.error(msg);
      } else {
        setPlans(data.response);
      }
    } catch {
      toast.error("Failed to fetch plans");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="p-10 relative z-10 bg-[url('/assets/letter-image.png')]">
        <div className="relative flex bg-[#F1FAEE] rounded-2xl pb-15 flex-col items-center justify-center min-h-screen">
          <div className="bg-[url('/assets/letter-image.png')] rounded-t-2xl w-full h-[250px] bg-cover bg-center flex justify-center items-center">
            <div className="text-center text-white px-4 py-12">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 font-[Cormorant_Garamond]">
                How do you want to continue?
              </h1>
              <p className="text-lg sm:text-xl text-white/90">
                Choose which plan is right for you
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full mt-12 max-w-full px-6 md:px-0 items-stretch">
            {plans.map((plan, idx) => (
              <PricingCard key={idx} plan={plan} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
