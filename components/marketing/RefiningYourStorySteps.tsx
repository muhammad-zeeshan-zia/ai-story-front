import React from "react";
import { MarketingStep } from "@/api/marketingPageApis";

const defaultSteps: MarketingStep[] = [
  {
    number: "4",
    label: "Step 4 of 6",
    title: "Answer Clarity Questions",
    points: [
      "You'll be presented with personalized questions based on your memory.",
      "Answer as many questions as you can to add depth and detail to your story.",
      "After completing the questions, click \"Continue\" to let Compose refine your story.",
    ],
  },
  {
    number: "5",
    label: "Step 5 of 6",
    title: "Review Your Personal Story",
    points: [
      "Compose will integrate your answers and create a polished version of your memory.",
      "You'll receive your refined story along with title suggestions.",
      "This is your story, preserved and enhanced.",
    ],
  },
];

const RefiningYourStorySteps = ({
  content,
}: {
  content?: { title?: string; subtitle?: string; steps?: MarketingStep[] };
}) => {
  const steps = content?.steps?.length ? content.steps : defaultSteps;
  return (
    // Outer background to match the subtle off-white context
    <div className="w-full bg-[#F4F3EE] py-10 md:py-12 px-5 sm:px-8 font-sans flex justify-center">
      {/* Main White Card Container */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 lg:p-10">
        {/* Header Section */}
        <div className="mb-7">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#2E2E2E] mb-2 tracking-tight leading-[1.15] whitespace-pre-line">
            {content?.title ?? "Refining Your Story"}
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed whitespace-pre-line">
            {content?.subtitle ?? "Add depth and let AI enhance your narrative"}
          </p>
        </div>

        {/* Steps Container */}
        <div className="space-y-10">
          {steps.map((step, idx) => (
            <div key={`${step.number}-${idx}`} className="flex gap-5 sm:gap-6">
              <div className="shrink-0 w-10 h-10 rounded-full bg-[#76AEC3] text-white flex items-center justify-center font-bold text-sm mt-1">
                {step.number}
              </div>
              <div className="flex-1">
                <span className="block text-[#76AEC3] text-[11px] font-semibold tracking-[0.2em] uppercase mb-2 whitespace-pre-line">
                  {step.label}
                </span>
                <h3 className="font-serif text-xl font-medium text-[#2E2E2E] mb-3 leading-tight whitespace-pre-line">
                  {step.title}
                </h3>
                <div className="text-gray-600 text-sm md:text-base space-y-2 leading-relaxed">
                  {step.points?.map((point, pointIdx) => (
                    <p key={pointIdx} className="whitespace-pre-line">{point}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RefiningYourStorySteps;
