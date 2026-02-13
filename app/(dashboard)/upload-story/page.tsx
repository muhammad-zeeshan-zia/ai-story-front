"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PenTool, Mic } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { handleSessionExpiry } from "@/utils/handleSessionExpiry";
import { PrivateRoute } from "@/utils/RouteProtection";
import { toast } from "sonner";
const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

export default function ClarityQuestions() {
  const router = useRouter();
  const [story, setStory] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [activeMode, setActiveMode] = useState<"text" | "mic">("text");
  const [isLoading, setIsLoading] = useState(false);
  const [textTranscript, setTextTranscript] = useState("");
  const [errors, setErrors] = useState({
    story: "",
  });
  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    const storedStory = sessionStorage.getItem("story");
    if (storedStory) {
      setStory(storedStory);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("story", story);
  }, [story]);

  useEffect(() => {
    if (activeMode === "mic") {
      if (!browserSupportsSpeechRecognition) {
        toast.error("Browser doesn't support speech recognition");
        return setActiveMode("text");
      }
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-US",
      });
    } else {
      SpeechRecognition.stopListening();
    }
  }, [activeMode]);

  useEffect(() => {
    if (activeMode === "mic" && transcript) {
      setStory((prev) => {
        if (prev.endsWith(transcript)) return prev;
        return textTranscript + " " + transcript;
      });
    }
  }, [transcript, activeMode]);

  useEffect(() => {
    if (!listening) {
      resetTranscript();
    }
  }, [listening, activeMode]);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({
      story: "",
    });
    setDisabled(true);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${serverBaseUrl}/user/story/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ story }),
      });
      const data = await response.json();
      if (response.ok) {
        const storyId = data.response.storyId;
        const questions = data.response.questions;
        sessionStorage.setItem("storyId", storyId);
        sessionStorage.setItem("questions", questions);
        sessionStorage.removeItem("story");
        router.push("/clarity-questions");
      } else {
        if (handleSessionExpiry(data.message, router)) return;
        if (response.status === 403) {
          const error = typeof data.error;
          if (error === "object") {
            setErrors(data.error);
          }
        } else if (response.status === 402) {
          toast.error(data.message || "Please select a plan first");
          router.push("/select-plan");
          return;
        }
        const msg = data.message || "Failed to create your story";
        toast.error(msg);
      }
    } catch {
      toast.error("Failed to create your story");
    } finally {
      setIsLoading(false);
      setDisabled(false);
    }
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-white flex flex-col lg:flex-row justify-between gap-6 lg:gap-10 font-[Inter] p-6 sm:p-8 lg:p-10 bg-[url('/assets/clarity-questions-bg.png')] bg-cover bg-center w-full">
        {/* Left Panel - Questions */}
        <div className="flex-1 flex flex-col justify-between order-2 lg:order-1">
          <div className="flex flex-col justify-between h-full">
            {/* Header */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1D3557] mb-4 leading-tight font-[Cormorant_Garamond] font-bold">
              Let&apos;s explore your memory a little deeper
            </h1>
            <p className="text-[#5A9AAF] mb-8 sm:mb-10 lg:mb-12 text-lg sm:text-xl lg:text-[22px]">
              Answer these questions in your own way!
            </p>

            <div className="relative h-64 w-full">
              <div className="relative mb-6 h-full">
                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  disabled={activeMode === "mic"}
                  placeholder="Once upon a time... or perhaps it was just yesterday."
                  className="w-full h-full p-4 text-gray-800 bg-[#F1FAEE] border border-[#A8DADC] rounded-xl resize-none placeholder-gray-400 text-sm leading-relaxed focus:outline-none focus:border-[#457B9D] focus:ring-4 focus:ring-[#A8DADC]/50 transition-all duration-200"
                  rows={4}
                />

                {/* Floating Buttons */}
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button
                    onClick={() => {
                      setActiveMode("mic");
                      setTextTranscript(story);
                    }}
                    className={`p-2 rounded-full transition duration-200 shadow-lg ${
                      activeMode === "mic"
                        ? "bg-red-500 hover:bg-red-600 animate-pulse"
                        : "bg-[#457B9D] hover:bg-[#1D3557] hover:shadow-xl transform hover:scale-110"
                    }`}
                    title="Voice input"
                  >
                    <Mic className="w-4 h-4 text-white" />
                  </button>

                  <button
                    onClick={() => setActiveMode("text")}
                    className={`p-2 rounded-full transition duration-200 shadow-lg ${
                      activeMode === "text"
                        ? "bg-red-500 hover:bg-red-600 animate-pulse"
                        : "bg-[#457B9D] hover:bg-[#1D3557] hover:shadow-xl transform hover:scale-110"
                    }`}
                    title="Writing assistant"
                  >
                    <PenTool className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
              {errors?.story && (
                <p className="joi-error-message mb-4 text-xs">
                  {errors?.story[0]}
                </p>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-end text-[20px] items-center mt-4">
              <button
                onClick={handleContinue}
                disabled={story.trim().length === 0 || disabled}
                className="bg-[#457B9D] hover:bg-[#3A6B7F] text-white p-3 rounded-full font-medium transition-colors"
              >
                Continue your journey
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 relative order-1 lg:order-2 mb-6 sm:mb-0">
          <Image
            src={"/assets/clarity-confirmation-image.jpg"}
            width={2000}
            height={2000}
            alt="Clarity Question"
            className="w-full h-full object-cover object-right rounded-lg lg:rounded-tr-[120px]"
          />
        </div>

        {/* Loader */}
        {isLoading && (
          <div className="fixed flex flex-col justify-center items-center bg-[#0000007c] h-full w-full top-0 left-0 backdrop-blur-md z-50">
            <Image
              src={"/loader.svg"}
              width={100}
              height={100}
              alt="Loader"
              className="object-contain animate-spin"
            />
            <p className="text-[#F1FAEE] text-2xl font-[Cormorant_Garamond]">
              Crafting something beautiful from what you&apos;ve shared…
            </p>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
}
