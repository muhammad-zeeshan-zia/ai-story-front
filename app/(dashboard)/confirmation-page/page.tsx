"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import StoryImagePanel from "@/components/ui/StoryImagePanel";
import { useRouter } from "next/navigation";
import { PrivateRoute } from "@/utils/RouteProtection";

export default function ConfirmationPage() {
  const [isPublic, setIsPublic] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    setIsPublic(user?.public === true);
  }, []);

  return (
    <PrivateRoute>
      <div className="min-h-screen flex flex-col lg:flex-row justify-between gap-6 lg:gap-10 font-[Inter] p-6 sm:p-8 lg:p-10 bg-[#F1FAEE] w-full relative">
        {/* Left Panel */}
        <div className="flex-1 flex flex-col justify-between order-2 lg:order-1 h-full">
          <Image
            src="/success-tick.svg"
            width={80}
            height={80}
            alt="Success"
            className="object-contain mb-8"
          />
          <div className="flex flex-col justify-between">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1D3557] mb-4 leading-tight font-[Cormorant_Garamond] font-bold">
              Your Story is Ready!
            </h1>
            <div>
              {!isPublic ? (
                <p className="text-[#5A9AAF] mb-3 text-lg sm:text-xl lg:text-[22px]">
                  We’ve just sent your story to your inbox — a piece of your
                  past, now beautifully written.
                </p>
              ) : (
                <p className="text-[#5A9AAF] mb-3 text-lg sm:text-xl lg:text-[22px]">
                  Your story will be deleted automatically after 3 days. Until then, you can edit, download, or print it.
                </p>
              )}
              <p className="text-[#5A9AAF] mb-3 text-lg sm:text-xl lg:text-[22px]">
                We hope it made you smile, pause, or maybe even tear up. That
                means it worked.
              </p>
              <p className="text-[#5A9AAF] mb-8 sm:mb-10 lg:mb-12 text-lg sm:text-xl lg:text-[22px]">
                Every memory matters. Every story deserves to be told.
                <br />
                Thank you for trusting us with yours.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <button
                onClick={() => {
                  router.push("/story");
                }}
                className="bg-[#A8DADC] hover:bg-[#7FB8C4] text-[#457B9D] hover:text-[#2F4757] font-semibold w-full sm:w-48 py-3 rounded-full transition-colors"
              >
                View and Tweak Story
              </button>
              <button
                onClick={() => {
                  router.push("/upload-story");
                }}
                className="bg-[#A8DADC] hover:bg-[#7FB8C4] text-[#457B9D] hover:text-[#2F4757] font-semibold w-full sm:w-48 py-3 rounded-full transition-colors"
              >
                Create Another!
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <StoryImagePanel isConfirmation={true} />
      </div>
    </PrivateRoute>
  );
}
