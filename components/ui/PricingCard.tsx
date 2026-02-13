import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Check, Star, Zap, Crown } from "lucide-react";
import { handleSessionExpiry } from "@/utils/handleSessionExpiry";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;
// const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
 
const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string;

interface PricingPlan {
  _id: string;
  name: string;
  type: string;
  price: number;
  billingCycle: string;
  originalPrice?: number;
  features: string[];
  featured: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
}

const PricingCard = ({ plan }: PricingCardProps) => {
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  console.log("PK:", stripePublicKey);
  const handleCheckout = async (planId: string) => {
    setDisabled(true);
    if (!stripePublicKey) {
      toast.error("Stripe key is missing");
      return;
    }
    const stripe = await loadStripe(stripePublicKey);
    if (!stripe) {
      toast.error("Stripe failed to initialize");
      return;
    }

    const token = localStorage.getItem("token");
    const body = { planId };

    try {
      const response = await fetch(
        `${serverBaseUrl}/user/plan/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        if (handleSessionExpiry(responseData.message, router)) return;
        const msg = responseData.message || "Failed to create checkout";
        return toast.error(msg);
      } else {
        const session = responseData?.response?.data;
        await stripe.redirectToCheckout({
          sessionId: session.id,
        });
      }
    } catch (err) {
      console.log("err", err);
      toast.error("Failed to create checkout");
    } finally {
      setDisabled(false);
    }
  };

  const getCardIcon = () => {
    switch (plan.type) {
      case "DIY":
        return <Star className="w-5 h-5" />;
      case "DWY":
        return <Zap className="w-5 h-5" />;
      case "DFY":
        return <Crown className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  const getGradient = () => {
    if (plan.featured) {
      return "bg-gradient-to-br from-[#457B9D] to-[#1D3557]";
    } else {
      return "bg-gradient-to-br from-[#457B9D] to-[#565353]";
    }
  };

  return (
    <div
      className={`relative m-4 group transform transition-all duration-500 hover:scale-105 ${
        plan.featured ? "scale-105 z-10" : ""
      } w-full sm:max-w-[360px] h-full flex`}
    >
      <div
        className={`absolute -inset-1 ${getGradient()} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
      ></div>
      <div
        className={`relative ${
          plan.featured
            ? `${getGradient()} text-white shadow-2xl border-0`
            : "bg-white/80 backdrop-blur-xl text-gray-800 border border-gray-200/50 shadow-xl"
        } rounded-2xl transition-all duration-300 flex flex-col w-full`}
      >
        <div className="p-6 sm:p-8 text-center flex flex-col grow">
          <div className="mb-6">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4 ${
                plan.featured
                  ? "bg-white/20 text-white backdrop-blur-sm"
                  : `${getGradient()} text-white`
              }`}
            >
              {getCardIcon()}
              {plan.type}
            </div>

            <h3
              className={`text-xl sm:text-2xl font-bold mb-2 ${
                plan.featured ? "text-white" : "text-[#1D3557]"
              }`}
            >
              {plan.name}
            </h3>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-center mb-2">
              {plan.originalPrice && (
                <span
                  className={`text-lg line-through mr-2 ${
                    plan.featured ? "text-blue-200" : "text-[#565353]"
                  }`}
                >
                  ${plan.originalPrice}
                </span>
              )}
              <span
                className={`text-sm ${
                  plan.featured ? "text-blue-100" : "text-[#565353]"
                }`}
              >
                $
              </span>
              <span className="text-4xl sm:text-5xl font-bold">
                {plan.price}
              </span>
            </div>
            <div
              className={`text-sm ${
                plan.featured ? "text-blue-100" : "text-[#565353]"
              }`}
            >
              per {plan.billingCycle === "monthly" ? "month" : "year"}
            </div>
          </div>

          <div className="space-y-2 flex-grow h-full">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-start text-left">
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                    plan.featured
                      ? "bg-white/20 text-white"
                      : "bg-[#457B9D] text-white"
                  }`}
                >
                  <Check className="w-4 h-4" />
                </div>
                <span
                  className={`text-sm leading-relaxed ${
                    plan.featured ? "text-white" : "text-[#565353]"
                  }`}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <button
            className={`w-60 mx-auto absolute translate-x-[25%] rounded-full bottom-[-25px] left-0 py-4 px-6 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
              plan.featured
                ? "bg-white text-[#457B9D] hover:bg-[#E8F1F2] hover:text-[#1D3557] shadow-white/20 z-20"
                : `${getGradient()} text-white hover:shadow-2xl z-20`
            }`}
            disabled={disabled}
            onClick={() => {
              handleCheckout(plan._id);
            }}
          >
            <span className="flex items-center justify-center gap-2">
              Select Plan
              <Zap className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
