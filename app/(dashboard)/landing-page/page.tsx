"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import StoryPromptModal from "@/components/ui/StoryPromptModal";
import Testimonials from "@/components/Testimonials";
import GetInTouch from "@/components/GetInTouch";
import HowItWorks from "@/components/HowItWorks";
import AnyQueries from "@/components/AnyQueries";
import LeafCard from "@/components/ui/LeafCard";
import Footer from "@/components/Footer";

export default function LandingPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const paymentStatus = params.get("payment");

      if (paymentStatus === "true") {
        toast.success(
          "Thank you! Your payment was successful and your subscription is now active"
        );

        setTimeout(() => {
          const url = new URL(window.location.href);
          url.searchParams.delete("payment");
          window.history.replaceState({}, "", url.pathname + url.search);
        }, 3000);
      }
    }
  }, []);

  const leafData = [
    {
      title: "Writing Skills Not Needed",
      description: "Just your memories and your heart needed.",
      imageSrc: "/leaf-2.svg",
      imageWidth: 70,
      imageHeight: 151,
    },
    {
      title: "Talk or Type, Your Way",
      description:
        "Prefer speaking? Just say your thoughts. Prefer typing? That’s perfect too.",
      imageSrc: "/leaf-3.svg",
      imageWidth: 100,
      imageHeight: 144,
    },
    {
      title: "Unique Gentle Story Coach",
      description:
        "Your memories come alive, flowing with warmth, heart, and meaning.",
      imageSrc: "/leaf-4.svg",
      imageWidth: 76,
      imageHeight: 142,
    },
  ];

  const [showPromptModal, setShowPromptModal] = useState(false);

  return (
    <div className="">
      <div
        className="relative w-full py-15 md:h-screen bg-cover bg-center"
        style={{ backgroundImage: 'url("/assets/landing-page.jpg")' }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 text-white flex items-center px-10 md:px-15 h-full">
          <div>
            <h1 className="text-4xl sm:text-[85px] font-[Cormorant_Garamond] mb-4">
              <span className="block">Let’s Bring Your</span>
              <span className="block font-bold">Memories to Life</span>
            </h1>
            <p className="text-lg mb-6">
              You don’t need to write like a pro… <br />
              You just need to remember what made you smile.
            </p>
            <button
              onClick={() => setShowPromptModal(true)}
              className="flex gap-2 bg-[#457B9D] text-[#FAF9F6] py-2 px-8 rounded-full text-lg font-semibold hover:bg-[#375E73] transition"
            >
              <p>Give it a Try</p>
              <Image
                src="/double-greator-icon.svg"
                width={18}
                height={18}
                alt="Arrow"
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center px-5 items-center flex-col py-10 gap-5">
        <Image src={"/leaf-1.svg"} width={50} height={50} alt="leaf 1" />
        <h1 className="font-[Cormorant_Garamond] text-center px-10 text-4xl sm:text-6xl">
          Why You&apos;ll Love Using This
        </h1>
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {leafData.map((leaf, index) => (
            <LeafCard
              key={index}
              imageWidth={leaf.imageWidth}
              imageHeight={leaf.imageHeight}
              title={leaf.title}
              description={leaf.description}
              imageSrc={leaf.imageSrc}
            />
          ))}
        </div>
      </div>

      <div className="px-5 md:px-15 pb-15">
        <HowItWorks />
      </div>
      <div className="px-5 md:px-15 pb-15">
        <Testimonials />
      </div>
      <div className="px-5 md:px-15 pb-15">
        <AnyQueries />
      </div>
      <div className="px-5 md:px-15 pb-15">
        <GetInTouch />
      </div>
      <Footer />

      {showPromptModal && (
        <StoryPromptModal
          isOpen={showPromptModal}
          onClose={() => setShowPromptModal(false)}
        />
      )}
    </div>
  );
}
