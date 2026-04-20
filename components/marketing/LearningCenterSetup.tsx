import React from "react";
import { MarketingStep } from "@/api/marketingPageApis";
import MarketingVideo from "./MarketingVideo";

const defaultSteps: MarketingStep[] = [
  {
    number: "1",
    label: "Step 1 of 2",
    title: "Create a New Account",
    points: [
      "Here's how to Access Your \"10-Day Trial\" Learning Modules at CSG's Learning Center",
    ],
  },
  {
    number: "2",
    label: "Step 2 of 2",
    title: "Verify Active Email",
    points: [
      "After creating your Learning Center account, you'll verify your email.",
      "Click the verify button, check your email for the code, and enter it.",
      "You now have access to the Starter Kit Learning Modules.",
    ],
  },
];

const LearningCenterSetup = ({
  content,
}: {
  content?: {
    title?: string;
    paragraphs?: string[];
    videoUrl?: string;
    accountSetup?: { title?: string; subtitle?: string; steps?: MarketingStep[] };
  };
}) => {
  const steps = content?.accountSetup?.steps?.length
    ? content.accountSetup.steps
    : defaultSteps;
  const paragraphs = content?.paragraphs?.length
    ? content.paragraphs
    : [
        "Great work completing your practice stories... this is an important step.",
        "To continue, create your free account in the Capturing Story Gems - Learning Center.",
        "Your 10-day trial gives you access to guided modules with lessons and activities, all organized and ready for you.",
      ];

  return (
    // Outer wrapper with the light pastel blue background
    <div className="w-full bg-[#E5F1F4] py-10 md:py-12 px-5 sm:px-8 lg:px-12 font-sans flex justify-center">
      {/* Main Content Constrainer */}
      <div className="w-full max-w-6xl flex flex-col items-start">
        {/* Top Header Section */}
        <div className="mb-8">
          {/* Main Heading */}
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-[#2E2E2E] mb-4 tracking-tight leading-[1.15] whitespace-pre-line">
            {content?.title ?? "CSG Learning Center - Free 10-Day Trial"}
          </h2>

          {/* Description Paragraphs */}
          <div className="text-[#6C6C6C] text-sm md:text-base leading-relaxed space-y-2 max-w-3xl">
            {paragraphs.map((paragraph, idx) => (
              <p key={idx} className="whitespace-pre-line">{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="mb-8 w-full">
          <MarketingVideo videoUrl={content?.videoUrl} />
        </div>

        {/* Main White Card Container */}
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 lg:p-10">
          {/* Card Header Section */}
          <div className="mb-8">
            <h3 className="font-serif text-2xl font-semibold text-[#2E2E2E] mb-2 tracking-tight leading-[1.15] whitespace-pre-line">
              {content?.accountSetup?.title ?? "Account Setup"}
            </h3>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed whitespace-pre-line">
              {content?.accountSetup?.subtitle ??
                "Quick and easy registration to access your learning modules"}
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
                  <h4 className="font-serif text-xl font-medium text-[#2E2E2E] mb-3 leading-tight whitespace-pre-line">
                    {step.title}
                  </h4>
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
    </div>
  );
};

export default LearningCenterSetup;
