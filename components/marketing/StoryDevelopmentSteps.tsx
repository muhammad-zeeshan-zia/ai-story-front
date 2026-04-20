import React from "react";
import { MarketingStep } from "@/api/marketingPageApis";

const defaultSteps: MarketingStep[] = [
  {
    number: "4",
    label: "Step 4 of 7",
    title: "Clarify Your Story",
    points: [
      "After the analysis of the memory narrative... you're presented with 10 questions... if answered they will add more details and clarity to the story.",
      "Now go a little deeper into your memory.",
      "Answer the questions to add details, clarity and meaning. Answer as many as you can.",
      "After the 10th question, click \"Continue\" and let \"Compose\" refine your story.",
    ],
    timeNote: "This step usually takes about a minute.",
  },
  {
    number: "5",
    label: "Step 5 of 7",
    title: "Compose: Integrating, Editing, Smoothing",
    points: [
      "Compose blends in your added details, lightly edits your story, and smooths the flow.",
      "You'll then see your refined story, along with a main title and five additional title options.",
    ],
    timeNote: "This usually takes about a minute.",
  },
];

const StoryDevelopmentSteps = ({
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
        <div className="mb-8">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#2E2E2E] mb-2 tracking-tight leading-[1.15] whitespace-pre-line">
            {content?.title ?? "Story Development"}
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed whitespace-pre-line">
            {content?.subtitle ?? "Answer questions and let AI refine your narrative"}
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
                <div className="text-gray-600 text-sm md:text-base space-y-2 leading-relaxed mb-4">
                  {step.points?.map((point, pointIdx) => (
                    <p key={pointIdx} className="whitespace-pre-line">{point}</p>
                  ))}
                </div>
                {step.timeNote ? (
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                    <span className="whitespace-pre-line">{step.timeNote}</span>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryDevelopmentSteps;
