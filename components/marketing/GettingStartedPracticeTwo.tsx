import React from "react";
import { MarketingStep } from "@/api/marketingPageApis";

const defaultSteps: MarketingStep[] = [
  {
    number: "1",
    label: "Step 1 of 6",
    title: "Begin Practice Story 2",
    points: [
      "Click \"Give it a Try\" to start your second practice story.",
      "This time, you'll share your own memory in the \"Share Your Story\" text box.",
    ],
  },
  {
    number: "2",
    label: "Step 2 of 6",
    title: "Think of Your Own Memory",
    points: [
      "Take a moment to recall a memory that's meaningful to you.",
      "It can be simple or significant - what matters is that it holds personal meaning.",
      "Type your memory into the text box when you're ready.",
    ],
  },
  {
    number: "3",
    label: "Step 3 of 6",
    title: "Submit Your Memory",
    points: ["Once you've written your memory, submit it for analysis."],
    timeNote: "Wait about a minute while your memory narrative is analyzed.",
  },
];

const GettingStartedPracticeTwo = ({
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
            {content?.title ?? "Getting Started"}
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed whitespace-pre-line">
            {content?.subtitle ?? "Begin your personal memory journey"}
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

export default GettingStartedPracticeTwo;
