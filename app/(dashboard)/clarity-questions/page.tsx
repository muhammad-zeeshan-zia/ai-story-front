"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { FaChevronRight } from "react-icons/fa";
import { handleSessionExpiry } from "@/utils/handleSessionExpiry";
import { PrivateRoute } from "@/utils/RouteProtection";
const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

export default function ClarityQuestions() {
  const [storyId, setStoryId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    new Array(questions.length).fill("")
  );
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedStoryId = sessionStorage.getItem("storyId");
    setStoryId(storedStoryId);

    const stored = sessionStorage.getItem("questions");
    const questionArray = stored
      ? stored
          .split("?,")
          .map((q) => q.trim())
          .filter((q) => q.length > 0)
      : [];
    setQuestions(questionArray);
    setAnswers(new Array(questionArray.length).fill(""));
    if(!storedStoryId || !stored){
      router.push("/landing-page");
    }
  }, []);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = e.target.value;
    setAnswers(updatedAnswers);
  };

  const router = useRouter();

  const handleNextClick = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
      handleCreateStory();
    }
  };
  const handleSkipClick = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
      handleCreateStory();
    }
  };
  const handleCreateStory = async () => {
    setIsLoading(true);
    const qa = questions.map((question, index) => ({
      question,
      answer: answers[index],
    }));

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${serverBaseUrl}/user/story/generate?story_id=${storyId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            qa,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        if (handleSessionExpiry(data.message, router)) return;
        const msg = data.message || "Failed to create story";
        return toast.error(msg);
      } else {
        sessionStorage.removeItem("questions");
        router.push("/confirmation-page");
        toast.success("Story created successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create story");
    } finally {
      setIsLoading(false);
    }
  };




  return (
    <PrivateRoute>
      <div className="min-h-screen flex flex-col lg:flex-row justify-between gap-6 lg:gap-10 font-[Inter] p-6 sm:p-8 lg:p-10 bg-[url('/assets/clarity-questions-bg.png')] bg-white bg-cover bg-center w-full">
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

            {/* Progress Bar and Question Info */}
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between text-sm sm:text-[18px] text-[#1D3557]">
                <div>Question {currentQuestionIndex + 1}:</div>
                <div>
                  {currentQuestionIndex + 1}/{questions.length}
                </div>
              </div>
              <div className="w-full bg-[#FFFDF9] border border-[#A8DADC] rounded-full h-2 sm:h-3">
                <div
                  className="bg-[#5A9AAF] h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestionIndex + 1) / questions.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

        
            {/* Current Question */}
            <p className="text-lg sm:text-xl lg:text-[28px] font-medium text-[#1D3557] mb-6">
              {questions[currentQuestionIndex]}
            </p>

            {/* Answer Input */}
            <div className="mb-8 relative">
              <textarea
                value={answers[currentQuestionIndex]}
                onChange={handleAnswerChange}
                placeholder="Type your answer here..."
                className="w-full h-36 sm:h-48 lg:h-55 p-4 border border-[#A8DADC] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#457B9D] focus:border-transparent text-[#457B9D] bg-[#F1FAEE] placeholder-[#457B9D] text-base sm:text-lg lg:text-xl"
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between text-lg sm:text-[20px] items-center">
              <button
                className="text-[#5A9AAF] hover:text-gray-600 flex items-center gap-2"
                onClick={handleSkipClick}
              >
                Skip
                <FaChevronRight />
              </button>
              <button
                className="bg-[#457B9D] hover:bg-[#3A6B7F] text-white w-40 sm:w-48 py-3 rounded-full font-medium transition-colors"
                onClick={handleNextClick}
              >
                {isFinished ? "Create My Story" : "Next"}
              </button>
            </div>
          </div>
        </div>
                                                                                                                                                                      
        {/* Right Panel - Image */}
        <div className="w-full lg:w-1/2 relative order-1 lg:order-2 mb-6 sm:mb-0">
          <Image
            src={"/assets/clarity-question-image.jpg"}
            width={2000}
            height={2000}
            alt="Clarity Question"
            className="w-full h-full object-cover rounded-lg lg:rounded-tr-[120px]"
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
