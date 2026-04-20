import React from "react";
import { MarketingStep } from "@/api/marketingPageApis";

const defaultSteps: MarketingStep[] = [
  {
    number: "6",
    label: "Step 6 of 7",
    title: "Review and Revise Story as Desired",
    points: [
      "When your refined story appears, you'll see several options... each starts with a button.",
      "A good first step is to click \"Revise\" to make quick edits.",
      "For bigger changes and for backup, copy the story (and listed title options), then paste it into your own document to continue editing and organizing.",
      "In our subscription support options... we provide a Story Sheet to help you organize, save, and prepare your stories for creating a storybook.",
    ],
  },
  {
    number: "7",
    label: "Step 7 of 7",
    title: "Great Job!",
    points: [
      "Congratulations! You've completed your first practice story using CSG's core memory-to-story process.",
      "In Practice 2, this time, instead of using a provided example, you'll use your own memory experience.",
    ],
  },
];

const ReviewAndCompleteSteps = ({
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
            {content?.title ?? "Review and Complete"}
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed whitespace-pre-line">
            {content?.subtitle ?? "Polish your story and finish your first practice"}
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

export default ReviewAndCompleteSteps;
